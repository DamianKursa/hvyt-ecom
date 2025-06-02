// pages/api/bestsellers.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache';

const CACHE_TTL = 6 * 3600;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Parse perPage from query (default = 12)
  const perPageRaw = Array.isArray(req.query.perPage)
    ? req.query.perPage[0]
    : req.query.perPage || '12';
  const perPage = parseInt(perPageRaw, 10) || 12;

  // Build a cache key that includes perPage
  const cacheKey = `bestsellers:${perPage}`;

  // 1) Try returning from cache
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      // `cached` should already be a parsed object: { products: [...] }
      return res.status(200).json(cached);
    }
  } catch (e) {
    console.warn('Redis GET failed (continuing):', e);
    // If cache read fails, we simply fetch fresh
  }

  // 2) Cache miss → fetch from WooCommerce
  const wcBase = process.env.REST_API;         // e.g. "https://hvyt.pl/wp-json/wc/v3"
  const wcKey = process.env.WC_CONSUMER_KEY;   // e.g. "ck_xxx"
  const wcSecret = process.env.WC_CONSUMER_SECRET; // e.g. "cs_xxx"

  if (!wcBase || !wcKey || !wcSecret) {
    console.error(
      'Missing one of: REST_API, WC_CONSUMER_KEY, or WC_CONSUMER_SECRET'
    );
    return res.status(500).json({
      message:
        'WooCommerce credentials not configured properly (REST_API, WC_CONSUMER_KEY, WC_CONSUMER_SECRET).',
    });
  }

  // Create an Axios instance with Basic Auth
  const WooCommerceAPI = axios.create({
    baseURL: wcBase,
    auth: {
      username: wcKey,
      password: wcSecret,
    },
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      Referer: 'https://hvyt.pl',
    },
    // Uncomment if you need to bypass a self-signed cert:
    // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  try {
    const response = await WooCommerceAPI.get('/products', {
      params: {
        per_page: perPage,
        orderby: 'popularity', // sort by total_sales descending
        status: 'publish',
      },
    });

    const payload = { products: response.data };

    // 3) Store in cache before returning
    try {
      await setCache(cacheKey, payload, CACHE_TTL);
    } catch (e) {
      console.warn('Redis SET failed:', e);
      // Even if caching fails, we still return the fresh payload
    }

    return res.status(200).json(payload);
  } catch (err: any) {
    console.error(
      'WooCommerce fetch error (firewall might be blocking):',
      err.response?.data || err.message
    );
    return res
      .status(500)
      .json({ message: 'Failed to fetch bestsellers from WooCommerce.' });
  }
}

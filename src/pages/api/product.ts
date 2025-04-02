import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProductBySlug } from '../../utils/api/woocommerce';
import { getCache, setCache } from '../../lib/cache';

const STATIC_TTL = 21600; // Cache static data for 6 hours

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  
  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    res.status(400).json({ error: 'Invalid slug' });
    return;
  }

  try {
    // Fetch full product data from WooCommerce
    const productData = await fetchProductBySlug(slug);

    // Separate dynamic fields (e.g. stock data) from static fields
    const { stock_quantity, stock_status, ...staticData } = productData;
    const dynamicData = { stock_quantity, stock_status };

    // Attempt to retrieve cached static data
    const cacheKey = `staticProductData:${slug}`;
    let cachedStaticData = await getCache(cacheKey);
    if (!cachedStaticData) {
      // Cache static data if not available
      await setCache(cacheKey, staticData, STATIC_TTL);
      cachedStaticData = staticData;
    }

    // Merge static and dynamic data before sending the response
    const mergedData = { ...cachedStaticData, ...dynamicData };

    res.status(200).json(mergedData);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ error: 'Error loading product data' });
  }
}

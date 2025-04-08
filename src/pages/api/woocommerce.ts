// pages/api/woocommerce.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCategoryBySlug,
  fetchProductBySlug,
  fetchMediaById,
  fetchKolekcjePostsWithImages,
  fetchNowosciPosts,
  fetchProductAttributesWithTerms,
  fetchLatestKolekcja,
  fetchProductsByAttribute,
  fetchCrossSellProducts,
  searchProducts,
  fetchInstagramPosts,
} from '../../utils/api/woocommerce';

import { getCache, setCache } from '../../lib/cache';

const CACHE_TTL = 3600;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  try {
    switch (action) {
      case 'fetchCategoryBySlug': {
        const { slug } = req.query;
        if (req.method !== 'GET' || !slug || typeof slug !== 'string') {
          return res.status(400).json({ error: 'Invalid slug' });
        }
        const cacheKey = `fetchCategoryBySlug:${slug}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchCategoryBySlug(slug);
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'fetchProductBySlug': {
        const { slug } = req.query;
        if (req.method !== 'GET' || !slug || typeof slug !== 'string') {
          return res.status(400).json({ error: 'Invalid slug' });
        }

        const result = await fetchProductBySlug(slug);
        return res.status(200).json(result);
      }

      case 'fetchMediaById': {
        const { mediaId } = req.query;
        const id = parseInt(mediaId as string, 10);
        if (req.method !== 'GET' || isNaN(id)) {
          return res.status(400).json({ error: 'Invalid mediaId' });
        }

        const cacheKey = `fetchMediaById:${id}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json({ source_url: cached });

        const result = await fetchMediaById(id);
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json({ source_url: result });
      }

      case 'fetchKolekcjePostsWithImages': {
        const cacheKey = 'fetchKolekcjePostsWithImages';
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchKolekcjePostsWithImages();
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'fetchNowosciPosts': {
        const cacheKey = 'fetchNowosciPosts';
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchNowosciPosts();
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'fetchProductAttributesWithTerms': {
        const { categoryId } = req.query;
        const id = parseInt(categoryId as string, 10);
        if (req.method !== 'GET' || isNaN(id)) {
          return res.status(400).json({ error: 'Invalid categoryId' });
        }

        const cacheKey = `fetchProductAttributesWithTerms:${id}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchProductAttributesWithTerms(id);
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'fetchLatestKolekcja': {
        const cacheKey = 'fetchLatestKolekcja';
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchLatestKolekcja();
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'fetchProductsByAttribute': {
        const { kolekcja } = req.query;
        if (req.method !== 'GET' || typeof kolekcja !== 'string') {
          return res.status(400).json({ error: 'Invalid kolekcja' });
        }

        const cacheKey = `fetchProductsByAttribute:${kolekcja}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchProductsByAttribute(kolekcja);
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'fetchCrossSellProducts': {
        const { productId } = req.query;
        if (req.method !== 'GET' || typeof productId !== 'string') {
          return res.status(400).json({ error: 'Invalid productId' });
        }

        const cacheKey = `fetchCrossSellProducts:${productId}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchCrossSellProducts(productId);
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'searchProducts': {
        const { query, perPage } = req.query;
        const q = query as string;
        const pp = perPage ? parseInt(perPage as string, 10) : 10;

        if (!q) return res.status(400).json({ error: 'Invalid query' });

        const cacheKey = `searchProducts:${q}:${pp}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await searchProducts(q, pp);
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      case 'fetchInstagramPosts': {
        const cacheKey = 'fetchInstagramPosts';
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);

        const result = await fetchInstagramPosts();
        await setCache(cacheKey, result, CACHE_TTL);
        return res.status(200).json(result);
      }

      default:
        return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('WooCommerce API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

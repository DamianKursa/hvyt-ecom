// pages/api/woocommerce.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCategoryBySlug,
  fetchProductBySlug,
  fetchProductById,
  fetchVariationById,
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

import { deleteCache, getCache, setCache } from '../../lib/cache';
import { getCurrentLanguage } from '@/utils/i18n/config';

const CACHE_TTL = 3600;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, lang } = req.query;

  
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

      case 'fetchProductById': {
        const { id } = req.query;
        if (req.method !== 'GET' || typeof id !== 'string') {
          return res.status(400).json({ error: 'Invalid id' });
        }
        const result = await fetchProductById(id, lang as string);
        return res.status(200).json(result);
      }

      case 'fetchVariationById': {
        const { productId, variationId } = req.query;
        if (
          req.method !== 'GET' ||
          typeof productId !== 'string' ||
          typeof variationId !== 'string'
        ) {
          return res.status(400).json({ error: 'Invalid productId/variationId' });
        }
        const result = await fetchVariationById(productId, variationId);
        return res.status(200).json(result);
      }

      case 'batchFetchPrices': {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        const items = Array.isArray((req.body as any)?.items) ? (req.body as any).items : [];
        if (!items.length) {
          return res.status(400).json({ error: 'No items provided' });
        }

        const updates = await Promise.all(
          items.map(async (it: any) => {
            try {
              if (it?.variationId) {
                const v = await fetchVariationById(String(it.productId), String(it.variationId));
                return {
                  cartKey: String(it.cartKey),
                  price: v?.price ?? v?.sale_price ?? v?.regular_price,
                  regular_price: v?.regular_price,
                  sale_price: v?.sale_price,
                  on_sale: !!v?.on_sale,
                };
              }
              if (it?.productId) {
                const p = await fetchProductById(String(it.productId), lang as string);
                return {
                  cartKey: String(it.cartKey),
                  price: p?.price ?? p?.sale_price ?? p?.regular_price,
                  regular_price: p?.regular_price,
                  sale_price: p?.sale_price,
                  on_sale: !!p?.on_sale,
                };
              }
              if (it?.slug) {
                const p = await fetchProductBySlug(String(it.slug));
                return {
                  cartKey: String(it.cartKey),
                  price: p?.price ?? p?.sale_price ?? p?.regular_price,
                  regular_price: p?.regular_price,
                  sale_price: p?.sale_price,
                  on_sale: !!p?.on_sale,
                };
              }
            } catch (e) {
              console.error('batchFetchPrices item failed', it, e);
            }
            return null;
          })
        );

        return res.status(200).json({ updates: updates.filter(Boolean) });
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
        const cacheKey = `fetchKolekcjePostsWithImages_${lang as string}`;
        const cached = await getCache(cacheKey); 
        if (cached) return res.status(200).json(cached);

        const result = await fetchKolekcjePostsWithImages(lang as string);
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

        const cacheKey = `fetchCrossSellProducts:${productId}_${lang}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.status(200).json(cached);
        

        const result = await fetchCrossSellProducts(productId, lang as string);
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

        const result = await searchProducts(q, pp, getCurrentLanguage());
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

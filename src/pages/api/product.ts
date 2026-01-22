import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProductById, fetchProductBySlug } from '../../utils/api/woocommerce';
import { getCache, setCache } from '../../lib/cache';
import { fetchProductIdBySlug } from '@/utils/api/woocommerce_custom';

const STATIC_TTL = 21600; // Cache static data for 6 hours

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  
  const { slug, idbyslug, id, lang } = req.query;

  // PRODUCT BY SLUG
  if( (slug && typeof slug === 'string') || (id && typeof id === 'string') ) {
    try {
      // Fetch full product data from WooCommerce
      let productData;
      if( id && typeof id === 'string') {
        productData = await fetchProductById(id, lang as string);
      } else if(slug && typeof slug === 'string') {
        productData = await fetchProductBySlug(slug);
      }
      
      if (!productData) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Remove dynamic fields from static data.
      // Here, we treat both top-level stock fields and the variations array as dynamic.
      const { stock_quantity, stock_status, baselinker_variations, ...staticData } = productData;
      const dynamicData = { 
        stock_quantity, 
        stock_status, 
        baselinker_variations // always update variation data
      };

      // Attempt to retrieve cached static data
      const cacheKey = `staticProductData:${slug + '-' + id}`;
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

  // PRODUCT ID BY SLUG
  else if( idbyslug && typeof idbyslug === 'string' ) {
    try {
      // Fetch full product data from WooCommerce
      const productId = await fetchProductIdBySlug(idbyslug);
      
      if (!productId) {
        return res.status(404).json({ error: 'Product ID not found' });
      }

      res.status(200).json(productId);
    } catch (error) {
      console.error('Error fetching product ID by slug:', error);
      res.status(500).json({ error: 'Error loading product data' });
    }
  }  else {
    res.status(400).json({ error: 'Invalid slug or id' });
    return;
  }

}

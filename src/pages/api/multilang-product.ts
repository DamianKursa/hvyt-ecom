import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProductById, fetchProductBySlug } from '../../utils/api/woocommerce';
import { getCache, setCache } from '../../lib/cache';
import { fetchMultilangProductById, fetchMultilangProductBySlug } from '@/utils/api/woocommerce_custom';

const STATIC_TTL = 21600; // Cache static data for 6 hours
// const acceptedProps = ['id', 'slug', 'lang'];

type requestQuery = {
  id?: number | string;
  slug?: string;
  lang?: string;
}

const hasValidProps = (query: requestQuery) => {
  return query && (query.slug || query.id);
} 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  
  if(!hasValidProps(req.query)) {
    res.status(400).json({ error: 'Invalid query' });
    return;
  }

  const { slug, id, lang } = req.query;

  // if ( ( !slug || typeof slug !== 'string') ) {
  //   res.status(400).json({ error: 'Invalid slug' });
  //   return;
  // }

  try {
    let productData;
    // Fetch full product data from WooCommerce
    if( id ) {
      console.log('fetch product by id');
      productData = await fetchMultilangProductById(Number(id));
    }
    else if( slug ) {
      console.log('fetch product by slug');
      productData = await fetchMultilangProductBySlug(slug as string);
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
    const cacheKey = `staticProductData:${id}`;
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

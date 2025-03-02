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

} from '../../utils/api/woocommerce-off';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  try {
    switch (action) {
      case 'fetchCategoryBySlug': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const { slug } = req.query;
        if (!slug || typeof slug !== 'string')
          return res.status(400).json({ error: 'Missing or invalid slug' });
        const result = await fetchCategoryBySlug(slug);
        return res.status(200).json(result);
      }
      case 'fetchProductBySlug': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const { slug } = req.query;
        if (!slug || typeof slug !== 'string')
          return res.status(400).json({ error: 'Missing or invalid slug' });
        const result = await fetchProductBySlug(slug);
        return res.status(200).json(result);
      }
      case 'fetchMediaById': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const { mediaId } = req.query;
        const id = parseInt(mediaId as string, 10);
        if (isNaN(id))
          return res.status(400).json({ error: 'Invalid mediaId' });
        const result = await fetchMediaById(id);
        return res.status(200).json({ source_url: result });
      }
      case 'fetchKolekcjePostsWithImages': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const result = await fetchKolekcjePostsWithImages();
        return res.status(200).json(result);
      }
      case 'fetchNowosciPosts': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const result = await fetchNowosciPosts();
        return res.status(200).json(result);
      }
      case 'fetchProductAttributesWithTerms': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const { categoryId } = req.query;
        const id = parseInt(categoryId as string, 10);
        if (isNaN(id))
          return res.status(400).json({ error: 'Invalid categoryId' });
        const result = await fetchProductAttributesWithTerms(id);
        return res.status(200).json(result);
      }
      case 'fetchLatestKolekcja': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const result = await fetchLatestKolekcja();
        return res.status(200).json(result);
      }
      case 'fetchProductsByAttribute': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const { kolekcja } = req.query;
        if (!kolekcja || typeof kolekcja !== 'string')
          return res.status(400).json({ error: 'Missing or invalid kolekcja' });
        const result = await fetchProductsByAttribute(kolekcja);
        return res.status(200).json(result);
      }
      case 'fetchCrossSellProducts': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const { productId } = req.query;
        if (!productId || typeof productId !== 'string')
          return res.status(400).json({ error: 'Missing or invalid productId' });
        const result = await fetchCrossSellProducts(productId);
        return res.status(200).json(result);
      }
      case 'searchProducts': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const { query, perPage } = req.query;
        if (!query || typeof query !== 'string')
          return res.status(400).json({ error: 'Missing or invalid query' });
        const perPageNum = perPage ? parseInt(perPage as string, 10) : 10;
        const result = await searchProducts(query, perPageNum);
        return res.status(200).json(result);
      }
      case 'fetchInstagramPosts': {
        if (req.method !== 'GET')
          return res.status(405).json({ error: 'Method not allowed' });
        const result = await fetchInstagramPosts();
        return res.status(200).json(result);
      }
      default:
        return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('Error in woocomerce API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchProductAttributesWithTerms,
  fetchProductsWithFilters,
  fetchSortedProducts,
} from '../../utils/api/category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { action } = req.query;

  try {
    if (action === 'fetchCategoryBySlug') {
      // Expects: ?action=fetchCategoryBySlug&slug=your-category-slug
      const { slug } = req.query;
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid slug parameter' });
      }
      const result = await fetchCategoryBySlug(slug);
      return res.status(200).json(result);

    } else if (action === 'fetchProductsByCategoryId') {
      // Expects: ?action=fetchProductsByCategoryId&categoryId=123&page=1&perPage=12&sortingOption=default&filters=[{"name":"color","value":"red"}]
      const { categoryId, page, perPage, sortingOption, filters } = req.query;
      if (!categoryId) {
        return res.status(400).json({ error: 'categoryId parameter is required' });
      }
      const catId = parseInt(categoryId as string, 10);
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const perPageNum = perPage ? parseInt(perPage as string, 10) : 12;
      let parsedFilters: { name: string; value: string }[] = [];
      if (filters) {
        try {
          parsedFilters = JSON.parse(filters as string);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid filters parameter. Must be valid JSON.' });
        }
      }
      const result = await fetchProductsByCategoryId(
        catId,
        pageNum,
        perPageNum,
        parsedFilters,
        (sortingOption as string) || 'default'
      );
      return res.status(200).json(result);

    } else if (action === 'fetchProductAttributesWithTerms') {
      // Expects: ?action=fetchProductAttributesWithTerms&categoryId=123
      const { categoryId } = req.query;
      if (!categoryId) {
        return res.status(400).json({ error: 'categoryId parameter is required' });
      }
      const catId = parseInt(categoryId as string, 10);
      const result = await fetchProductAttributesWithTerms(catId);
      return res.status(200).json(result);

    } else if (action === 'fetchProductsWithFilters') {
      // Expects: ?action=fetchProductsWithFilters&categoryId=123&filters=[{"name":"price","value":"10-50"}]&page=1&perPage=12
      const { categoryId, filters, page, perPage } = req.query;
      if (!categoryId || !filters) {
        return res.status(400).json({ error: 'categoryId and filters parameters are required' });
      }
      const catId = parseInt(categoryId as string, 10);
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const perPageNum = perPage ? parseInt(perPage as string, 10) : 12;
      let parsedFilters: { name: string; value: string }[] = [];
      try {
        parsedFilters = JSON.parse(filters as string);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid filters parameter. Must be valid JSON.' });
      }
      const result = await fetchProductsWithFilters(catId, parsedFilters, pageNum, perPageNum);
      return res.status(200).json(result);

    } else if (action === 'fetchSortedProducts') {
      // Expects: ?action=fetchSortedProducts&categoryId=123&orderby=price&order=asc&page=1&perPage=12
      const { categoryId, orderby, order, page, perPage } = req.query;
      if (!categoryId || !orderby || !order) {
        return res.status(400).json({ error: 'categoryId, orderby, and order parameters are required' });
      }
      const catId = parseInt(categoryId as string, 10);
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const perPageNum = perPage ? parseInt(perPage as string, 10) : 12;
      const result = await fetchSortedProducts(catId, orderby as string, order as string, pageNum, perPageNum);
      return res.status(200).json(result);

    } else {
      return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

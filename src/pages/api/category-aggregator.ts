import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchProductAttributesWithTerms,
} from '../../utils/api/category';
import { getCache, setCache } from '@/lib/cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { slug, page = "1", perPage = "12", sortingOption = "default", filters } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid slug parameter' });
  }

  const cacheKey = `category:slug=${slug}:page=${page}:perPage=${perPage}:sort=${sortingOption}:filters=${filters || 'none'}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const category = await fetchCategoryBySlug(slug);
    const categoryId = category.id;

    let parsedFilters: { name: string; value: string }[] = [];
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters as string);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid filters parameter. Must be valid JSON.' });
      }
    }

    const productsData = await fetchProductsByCategoryId(
      categoryId,
      parseInt(page as string, 10),
      parseInt(perPage as string, 10),
      parsedFilters,
      sortingOption as string
    );
    const attributes = await fetchProductAttributesWithTerms(categoryId);

    const responseData = {
      category,
      products: productsData.products,
      totalProducts: productsData.totalProducts,
      attributes,
    };

    await setCache(cacheKey, responseData, 21500); 

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in aggregator endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

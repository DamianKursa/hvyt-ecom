import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchProductAttributesWithTerms,
} from '../../utils/api/category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { slug, page = "1", perPage = "12", sortingOption = "default", filters } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid slug parameter' });
  }

  try {
    // Fetch the category data by slug
    const category = await fetchCategoryBySlug(slug);
    const categoryId = category.id;

    // Parse filters if provided
    let parsedFilters: { name: string; value: string }[] = [];
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters as string);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid filters parameter. Must be valid JSON.' });
      }
    }

    // Fetch products and attributes for the category
    const productsData = await fetchProductsByCategoryId(
      categoryId,
      parseInt(page as string, 10),
      parseInt(perPage as string, 10),
      parsedFilters,
      sortingOption as string
    );
    const attributes = await fetchProductAttributesWithTerms(categoryId);

    return res.status(200).json({
      category,
      products: productsData.products,
      totalProducts: productsData.totalProducts,
      attributes,
    });
  } catch (error) {
    console.error('Error in aggregator endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

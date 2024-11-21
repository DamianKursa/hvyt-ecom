import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCategoryBySlug,
  fetchProductAttributesWithTerms,
  fetchProductsByCategoryId,
} from '../../utils/api/woocommerce';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, page = 1, perPage = 12, filters = '[]', sortingOption = 'default' } = req.query;

  try {
    const category = await fetchCategoryBySlug(slug as string);
    const [attributes, { products, totalProducts }] = await Promise.all([
      fetchProductAttributesWithTerms(category.id),
      fetchProductsByCategoryId(category.id, Number(page), Number(perPage), JSON.parse(filters as string), sortingOption as string),
    ]);

    res.status(200).json({
      category,
      attributes,
      products,
      totalProducts,
    });
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).json({ error: 'Error fetching category data' });
  }
}
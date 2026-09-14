import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
  fetchProductAttributesWithTerms,
  fetchProductsWithFilters,
  fetchSortedProducts,
} from '../../utils/api/category';

export const maxDuration = 20;

const parsePositiveId = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number.parseInt(raw || '', 10);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return id;
};

const logCategoryApiError = (req: NextApiRequest, error: unknown) => {
  const axiosError = error as {
    message?: string;
    response?: { status?: number; data?: unknown };
  };
  console.error('Error in category API handler:', {
    action: req.query.action,
    categoryId: req.query.categoryId,
    slug: req.query.slug,
    status: axiosError?.response?.status,
    data: axiosError?.response?.data,
    message: axiosError?.message || (error instanceof Error ? error.message : error),
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { action, lang = '' } = req.query;

  try {
    if (action === 'fetchCategoryBySlug') {
      const { slug } = req.query;
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid slug parameter' });
      }
      const result = await fetchCategoryBySlug(slug, lang as string);
      return res.status(200).json(result);

    } else if (action === 'fetchProductsByCategoryId') {
      const { categoryId, page, perPage, sortingOption, filters, lang } = req.query;
      const catId = parsePositiveId(categoryId);
      if (!catId) {
        return res.status(400).json({ error: 'Valid categoryId parameter is required' });
      }
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
        (sortingOption as string) || 'default',
        lang as string,
      );
      return res.status(200).json(result);

    } else if (action === 'fetchProductAttributesWithTerms') {
      const { categoryId } = req.query;
      const catId = parsePositiveId(categoryId);
      if (!catId) {
        return res.status(400).json({ error: 'Valid categoryId parameter is required' });
      }
      const result = await fetchProductAttributesWithTerms(catId, lang as string);
      return res.status(200).json(result);

    } else if (action === 'fetchProductsWithFilters') {
      const { categoryId, filters, page, perPage, lang } = req.query;
      const catId = parsePositiveId(categoryId);
      if (!catId || !filters) {
        return res.status(400).json({ error: 'Valid categoryId and filters parameters are required' });
      }
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const perPageNum = perPage ? parseInt(perPage as string, 10) : 12;
      let parsedFilters: { name: string; value: string }[] = [];
      try {
        parsedFilters = JSON.parse(filters as string);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid filters parameter. Must be valid JSON.' });
      }
      const result = await fetchProductsWithFilters(catId, parsedFilters, pageNum, perPageNum, lang as string);
      return res.status(200).json(result);

    } else if (action === 'fetchSortedProducts') {
      const { categoryId, orderby, order, page, perPage } = req.query;
      const catId = parsePositiveId(categoryId);
      if (!catId || !orderby || !order) {
        return res.status(400).json({ error: 'Valid categoryId, orderby, and order parameters are required' });
      }
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const perPageNum = perPage ? parseInt(perPage as string, 10) : 12;
      const result = await fetchSortedProducts(catId, orderby as string, order as string, pageNum, perPageNum, lang as string);
      return res.status(200).json(result);

    } else {
      return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    logCategoryApiError(req, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

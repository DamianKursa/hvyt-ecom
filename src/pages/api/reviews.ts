import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache';

const CACHE_TTL = 3600; 

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API, 
  auth: {
    username: process.env.WC_CONSUMER_KEY || '', 
    password: process.env.WC_CONSUMER_SECRET || '', 
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const cacheKey = `reviews:product:${productId}`;
      const cachedReviews = await getCache(cacheKey);
      if (cachedReviews) {
        return res.status(200).json(cachedReviews);
      }

      const response = await WooCommerceAPI.get('/products/reviews', {
        params: {
          product: productId,
          per_page: 50,
        },
      });

      await setCache(cacheKey, response.data, CACHE_TTL);

      return res.status(200).json(response.data);
    } else if (method === 'POST') {
      const { productId, name, email, content, rating } = req.body;

      if (!productId || !name || !email || !content || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const response = await WooCommerceAPI.post('/products/reviews', {
        product_id: productId,
        reviewer: name,
        reviewer_email: email,
        review: content,
        rating,
      });

      return res.status(201).json(response.data);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in /api/reviews:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

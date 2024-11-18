import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '', // Consumer Key
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '', // Consumer Secret
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

      const response = await WooCommerceAPI.get('/products/reviews', {
        params: {
          product: productId, // Filter reviews by product ID
          per_page: 50,
        },
      });

      res.status(200).json(response.data);
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

      res.status(201).json(response.data);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in /api/reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

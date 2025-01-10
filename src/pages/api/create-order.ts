import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '', // Consumer Key from WooCommerce
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '', // Consumer Secret from WooCommerce
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderData = req.body;

  try {
    // Use the WooCommerceAPI instance to create the order
    const response = await WooCommerceAPI.post('/orders', orderData);
    res.status(200).json(response.data);
  } catch (err: unknown) {
    const error = err as AxiosError; // Explicitly cast to AxiosError
    console.error('Error creating order:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create order',
      details: error.response?.data || error.message,
    });
  }
}

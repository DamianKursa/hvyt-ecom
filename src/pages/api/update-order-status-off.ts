
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API, // e.g. https://wp.hvyt.pl/wp-json/wc/v3
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { orderId, status } = req.body;
  
  if (!orderId || !status) {
    return res.status(400).json({ error: 'Missing orderId or status' });
  }
  
  // Map gateway status to WooCommerce order status.
  // Adjust these mappings as needed.
  let wcStatus = 'on-hold';
  if (status === 'SUCCESS') wcStatus = 'processing';
  if (status === 'FAILURE') wcStatus = 'failed';
  
  try {
    const response = await WooCommerceAPI.put(`/orders/${orderId}`, { status: wcStatus });
    res.status(200).json({ message: 'Order status updated', data: response.data });
  } catch (error: any) {
    console.error('Error updating order status:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
}

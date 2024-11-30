import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';
import { Order } from '@/utils/functions/interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const validateResponse = await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (validateResponse.data.code !== 'jwt_auth_valid_token') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const url = `${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/orders/${id}`;
    const response = await axios.get<Order>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const order = response.data;

    res.status(200).json(order);
  } catch (error: any) {
    console.error('Error fetching order details:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching order details' });
  }
}

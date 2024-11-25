import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { token } = parse(req.headers.cookie || '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!process.env.WORDPRESS_API_URL) {
    return res.status(500).json({ message: 'Server misconfiguration: Missing API URL' });
  }

  try {
    const response = await axios.get(`${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/customers/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { id, first_name, last_name, email, billing, shipping, orders } = response.data;

    return res.status(200).json({
      id,
      first_name,
      last_name,
      email,
      billing,
      shipping,
      orders,
    });
  } catch (error: any) {
    return res.status(error.response?.status || 500).json({ message: error.message });
  }
}

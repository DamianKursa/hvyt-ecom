import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  if (req.method === 'GET') {
    try {
      const response = await axios.get(
        `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1/billing-addresses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.status(200).json(response.data);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to fetch billing addresses' });
    }
  }

  if (req.method === 'POST') {
    const { action, address, addresses } = req.body;

    try {
      const endpoint = action === 'add'
        ? '/billing-addresses/add'
        : '/billing-addresses/update';

      const response = await axios.post(
        `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1${endpoint}`,
        action === 'add' ? { address } : { addresses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to save billing address' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

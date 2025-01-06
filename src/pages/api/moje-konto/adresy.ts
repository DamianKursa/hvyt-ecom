// File: /pages/api/user/addresses.ts
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
      // Fetch user's addresses from WordPress or custom storage
      const response = await axios.get(
        `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1/user-addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.status(200).json(response.data);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  }

  if (req.method === 'POST') {
    const { addresses } = req.body; // Assume `addresses` is an array of up to 3 address objects
    if (!Array.isArray(addresses) || addresses.length > 3) {
      return res.status(400).json({ error: 'Invalid number of addresses' });
    }

    try {
      const response = await axios.post(
        `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1/user-addresses`,
        { addresses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status(200).json({ message: 'Addresses updated successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to update addresses' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

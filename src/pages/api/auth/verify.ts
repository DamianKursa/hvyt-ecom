import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const response = await axios.post(`${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

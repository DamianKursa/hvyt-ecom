import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received token verification request', { cookies: req.cookies });

  const { token } = req.cookies;

  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log('Validating token with WordPress API...');
    await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('Token is valid');
    res.status(200).json({ valid: true });
  } catch (error) {
    const err = error as any;
    console.error('Token validation error:', err.response?.data || err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
}

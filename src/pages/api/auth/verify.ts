import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { token } = req.cookies;

  if (!token) {

    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  try {

    await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.status(200).json({ valid: true });
  } catch (error) {
    const err = error as any;
    const statusCode = err.response?.status || 500;
    const message = err.response?.data?.message || err.message || 'Validation failed';
    res.status(statusCode).json({ message: `Invalid token: ${message}` });
  }
}

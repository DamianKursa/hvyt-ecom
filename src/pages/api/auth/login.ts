import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  try {
    // Authenticate with the WordPress REST API
    const response = await axios.post(`${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
      username,
      password,
    });

    const { token } = response.data;

    // Set token as a cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict', // Prevent CSRF
      path: '/', // Token available across all routes
      maxAge: 60 * 60 * 24, // 1 day
    }));

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received login request', { method: req.method, body: req.body });

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  try {
    console.log('Authenticating with WordPress API...');
    const response = await axios.post(`${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
      username,
      password,
    });

    const { token } = response.data;

    console.log('WordPress API response:', response.data);

    // Set token in cookies
    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })
    );

    console.log('Set-Cookie Header:', res.getHeader('Set-Cookie'));
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    const err = error as any;
    console.error('Login error:', err.response?.data || err.message);
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

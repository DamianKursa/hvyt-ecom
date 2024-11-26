import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { username, password } = req.body;

  try {
    const response = await axios.post(`${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
      username,
      password,
    });

    const { token, user_display_name } = response.data;

    // Set the token as an HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })
    );

    res.status(200).json({ message: 'Login successful', name: user_display_name });
  } catch (err) {
    const error = err as AxiosError;
    const statusCode = error.response?.status || 500;
    const errorMessage = (error.response?.data as { message: string })?.message || 'An error occurred';

    console.error('Login error:', errorMessage);
    res.status(statusCode).json({ message: errorMessage });
  }
}

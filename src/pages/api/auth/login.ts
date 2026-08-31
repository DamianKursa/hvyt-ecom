import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { serialize } from 'cookie';
import { getUserIdFromJwt } from '@/utils/auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { username, password, lang } = req.body;

  try {
    const response = await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token?lang=${lang}`,
      { username, password }
    );

    const { token, user_display_name, user_email } = response.data;
    const userId = getUserIdFromJwt(token);

    console.log('loggedin', user_display_name, userId);

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: true, //process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, 
        // domain: process.env.COOKIE_DOMAIN || '.hvyt.pl', 
      })
    );

    res.status(200).json({
      message: 'Login successful',
      id: userId || null,
      name: user_display_name,
      email: user_email || null,
    });
  } catch (err) {
    const error = err as AxiosError;
    const statusCode = error.response?.status || 500;
    const errorMessage = (error.response?.data as { message: string })?.message || 'An error occurred';

    console.error('Login error:', errorMessage);
    res.status(statusCode).json({ message: errorMessage });
  }
}

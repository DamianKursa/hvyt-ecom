import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { serialize } from 'cookie';
import { getUserIdFromJwt } from '@/utils/auth/jwt';
import { resolveCustomerPersonName } from '@/utils/auth/resolveCustomerName';
import { getAuthCookieOptions } from '@/utils/cookies';

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

    const { token, user_email } = response.data;
    const userId = getUserIdFromJwt(token);
    const { firstName, lastName, displayName } = await resolveCustomerPersonName(token);

    console.log('loggedin', displayName || user_email, userId);

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, getAuthCookieOptions(req, { maxAge: 60 * 60 * 24 })),
    );

    res.status(200).json({
      message: 'Login successful',
      id: userId || null,
      name: displayName || null,
      firstName: firstName || null,
      lastName: lastName || null,
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

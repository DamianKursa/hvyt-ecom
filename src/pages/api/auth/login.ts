import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  try {
    const response = await axios.post(`${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
      username,
      password,
    });

    const { token, user_email, user_display_name } = response.data;

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=2592000`);
    res.status(200).json({ user_email, user_display_name });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(401).json({ message: error.response?.data?.message || 'Invalid credentials' });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}

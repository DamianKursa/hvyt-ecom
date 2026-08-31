import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';
import { resolveCustomerPersonName } from '@/utils/auth/resolveCustomerName';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    const [{ firstName, lastName, displayName }, userRes] = await Promise.all([
      resolveCustomerPersonName(token),
      axios.get(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/users/me`, { headers }),
    ]);

    const userData: any = userRes.data || {};

    res.status(200).json({
      id: userData.id,
      name: displayName || null,
      firstName: firstName || null,
      lastName: lastName || null,
      username: userData.username || userData.slug,
      email: userData.email || null,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch user profile' });
  }
}

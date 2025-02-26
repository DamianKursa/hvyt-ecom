import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const response = await axios.get(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Destructure id along with name, username, email
    const { id, name, username, email } = response.data;
    res.status(200).json({ id, name, username, email });
  } catch (error: any) {
    console.error('Error fetching user from WordPress:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Failed to fetch user profile' });
  }
}

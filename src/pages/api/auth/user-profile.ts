import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const response = await axios.get(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { name, username, email } = response.data;
    res.status(200).json({ name, username, email });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.get(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?_embed`
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

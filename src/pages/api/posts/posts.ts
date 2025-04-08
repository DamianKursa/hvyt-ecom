import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, per_page = 10 } = req.query; 

  try {
    
    const response = await axios.get(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        params: {
          _embed: true,
          page, 
          per_page, 
        },
      }
    );

    const totalPages = response.headers['x-wp-totalpages'];

    res.status(200).json({
      posts: response.data,
      totalPages: parseInt(totalPages, 10) || 1,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      res.status(status).json({
        error: error.response?.data?.message || 'Failed to fetch posts',
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

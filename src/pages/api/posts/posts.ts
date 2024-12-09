import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, per_page = 10 } = req.query; // Default to page 1, 10 posts per page

  try {
    // Fetch posts from WordPress API with pagination
    const response = await axios.get(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        params: {
          _embed: true,
          page, // Current page
          per_page, // Posts per page
        },
      }
    );

    const totalPages = response.headers['x-wp-totalpages']; // Total number of pages from response headers

    res.status(200).json({
      posts: response.data,
      totalPages: parseInt(totalPages, 10) || 1,
    });
  } catch (error: any) {
    // Handle errors (e.g., invalid page number)
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

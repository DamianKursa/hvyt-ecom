import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { parse } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { section } = req.query;

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const url = `${process.env.WORDPRESS_API_URL}/wp-json/wc/v3/${section}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      console.error('Axios error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: error.response?.data || 'An error occurred while fetching data',
      });
    } else {
      // Generic error handling
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

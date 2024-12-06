import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { first_name, last_name, email, password } = req.body;

  try {
    const response = await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/custom/v1/register`,
      { first_name, last_name, email, password }
    );

    res.status(201).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error creating user';
      res.status(error.response?.status || 500).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, email, password } = req.body;

  try {
    const response = await axios.post(`${process.env.WORDPRESS_API_URL}/wp-json/custom/v1/register`, {
      username,
      email,
      password,
    });

    res.status(201).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(400).json({ message: error.response?.data?.message || 'Error creating user' });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    if (method === 'POST') {

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }

      const response = await axios.post(
        `${process.env.WORDPRESS_API_URL}/wp-json/custom/v1/reset-password`,
        { email }
      );

      return res.status(response.status).json({
        message: response.status === 200
          ? 'Password reset link has been sent.'
          : response.data.message || 'Error sending the reset link.',
      });
    }

    if (method === 'PUT') {

      const { key, login, password } = req.body;

      if (!key || !login || !password) {
        return res.status(400).json({
          message: 'Key, login, and password are required.',
        });
      }

      const response = await axios.post(
        `${process.env.WORDPRESS_API_URL}/wp-json/custom/v1/reset-password-confirm`,
        { key, login, password }
      );

      return res.status(response.status).json({
        message: response.status === 200
          ? 'Password has been successfully changed.'
          : response.data.message || 'Error changing the password.',
      });
    }

    res.setHeader('Allow', ['POST', 'PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);

    return res.status(500).json({
      message: error.response?.data?.message || 'Unexpected error occurred.',
    });
  }
};

export default handler;

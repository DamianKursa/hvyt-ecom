import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }

  try {
    // Validate the token with the WordPress API
    const validateResponse = await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (validateResponse.data.code !== 'jwt_auth_valid_token') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Decode the token to get the user ID
    const decodedToken = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
    ) as { data: { user: { id: number } } };

    const userId = decodedToken?.data?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token' });
    }

    // Optional: Ensure the user ID matches the one being updated
    if (req.body.userId && req.body.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own password' });
    }

    // Call the WordPress API to change the password
    const response = await axios.post(
      `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1/change-password`,
      { userId, currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(response.status).json({ error: 'Failed to update password' });
    }
  } catch (error: any) {
    console.error('Error updating password:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error updating password' });
  }
}

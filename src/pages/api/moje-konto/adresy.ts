import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  // Check for authorization token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch addresses from WordPress
      const response = await axios.get(
        `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1/user-addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Return fetched addresses
      console.log('Fetched addresses:', response.data);
      return res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error fetching addresses:', error.message);
      return res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  }

  if (req.method === 'POST') {
    const { action, address, addresses } = req.body;

    // Handle adding a new address
    if (action === 'add') {
      if (!address || typeof address !== 'object') {
        return res.status(400).json({ error: 'Invalid address payload.' });
      }

      try {
        const response = await axios.post(
          `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1/user-addresses/add`,
          { address },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Address added successfully:', response.data);
        return res.status(200).json({ message: 'Address added successfully' });
      } catch (error: any) {
        console.error('Error adding address:', error.message);
        return res.status(500).json({ error: 'Failed to add address' });
      }
    }

    // Handle updating addresses
    else if (action === 'update') {
      if (!Array.isArray(addresses) || addresses.length > 3) {
        return res.status(400).json({ error: 'You can only save up to 3 addresses.' });
      }

      try {
        const response = await axios.post(
          `${process.env.WORDPRESS_API_URL}/wp-json/custom-api/v1/user-addresses/update`,
          { addresses },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Addresses updated successfully:', response.data);
        return res.status(200).json({ message: 'Addresses updated successfully' });
      } catch (error: any) {
        console.error('Error updating addresses:', error.message);
        return res.status(500).json({ error: 'Failed to update addresses' });
      }
    }

    // Handle invalid action
    else {
      return res.status(400).json({ error: 'Invalid action specified.' });
    }
  }

  // Handle unsupported HTTP methods
  return res.status(405).json({ error: 'Method not allowed' });
}

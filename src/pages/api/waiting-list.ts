// pages/api/waiting-list.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, product_id } = req.body;
  if (!email || !product_id) {
    return res.status(400).json({ message: 'Email and product ID are required' });
  }

  try {
    const consumerKey = process.env.WC_CONSUMER_KEY || '';
    const consumerSecret = process.env.WC_CONSUMER_SECRET || '';
    const endpoint =
      process.env.BISN_ENDPOINT ||
      'https://hvyt.pl/wp-json/wc-instocknotifier/v3/create_subscriber';

    // Build the payload with required fields.
    const data = {
      subscriber_name: email, // using email as fallback for the name field
      email,
      product_id,
      variation_id: "",
      status: "cwg_subscribed",
      subscriber_phone: "0",
      custom_quantity: "1",
    };

    const response = await axios.post(endpoint, data, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });

    return res.status(200).json({ message: 'Successfully subscribed', data: response.data });
  } catch (error: any) {
    console.error('Error subscribing to waiting list:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

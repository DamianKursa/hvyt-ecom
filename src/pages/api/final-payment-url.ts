// pages/api/final-payment-url.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId, orderKey } = req.query;
  if (!orderId || !orderKey) {
    return res.status(400).json({ error: 'Missing orderId or orderKey' });
  }

  // Construct the internal order-pay URL (which is on wp.hvyt.pl)
  const wpUrl = `https://wp.hvyt.pl/zamowienie/order-pay/${orderId}/?key=${orderKey}`;

  try {
    // Request the URL without automatically following redirects.
    const response = await axios.get(wpUrl, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // If WordPress returns a redirect (status 3xx), the final payment URL should be in the Location header.
    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      return res.status(200).json({ finalUrl: response.headers.location });
    }

    // If there is no redirect, fallback to the original URL
    return res.status(200).json({ finalUrl: wpUrl });
  } catch (error: any) {
    console.error('Error fetching final payment URL:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get final URL' });
  }
}

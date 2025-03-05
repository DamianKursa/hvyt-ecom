import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId, orderKey } = req.query;
  if (!orderId || !orderKey) {
    return res.status(400).json({ error: 'Missing orderId or orderKey' });
  }
  
  // Construct the internal order-pay URL (on wp.hvyt.pl)
  const wpUrl = `https://wp.hvyt.pl/zamowienie/order-pay/${orderId}/?key=${orderKey}`;
  
  try {
    // Request the URL with redirects disabled so we capture the redirect header.
    const response = await axios.get(wpUrl, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    
    // If there is a redirect, the final URL is in the Location header.
    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      // Optionally replace domain if needed:
      const finalUrl = response.headers.location.replace('wp.hvyt.pl', 'hvyt.pl');
      return res.status(200).json({ finalUrl });
    }
    
    // Fallback: if no redirect, return the original URL.
    return res.status(200).json({ finalUrl: wpUrl });
  } catch (error: any) {
    console.error('Error fetching final payment URL:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get final URL' });
  }
}

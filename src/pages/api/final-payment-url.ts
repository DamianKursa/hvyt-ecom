import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Recursive function to follow redirects
async function getFinalUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      maxRedirects: 0, // do not automatically follow redirects
      validateStatus: (status) => status >= 200 && status < 400, // allow redirect statuses
    });

    // If we get here, no redirect header is present (status 200–299)
    return url;
  } catch (error: any) {
    // If the response is a redirect, axios throws an error with the response attached
    if (error.response && error.response.status >= 300 && error.response.status < 400) {
      const location = error.response.headers.location;
      if (!location) {
        throw new Error('Redirect with no location header');
      }
      // Create an absolute URL from relative redirects
      const nextUrl = new URL(location, url).toString();
      return getFinalUrl(nextUrl);
    }
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId, orderKey } = req.query;
  if (!orderId || !orderKey) {
    return res.status(400).json({ error: 'Missing orderId or orderKey' });
  }

  // Construct the initial WordPress order-pay URL (on wp.hvyt.pl)
  const wpUrl = `https://wp.hvyt.pl/zamowienie/order-pay/${orderId}/?key=${orderKey}`;
  
  try {
    // Recursively follow redirects to get the final URL.
    const finalUrl = await getFinalUrl(wpUrl);
    
    // Optionally, replace the internal domain with the public one:
    const publicUrl = finalUrl.replace('wp.hvyt.pl', 'hvyt.pl');
    
    return res.status(200).json({ finalUrl: publicUrl });
  } catch (error: any) {
    console.error('Error fetching final payment URL:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get final URL' });
  }
}

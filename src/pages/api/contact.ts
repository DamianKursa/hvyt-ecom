import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Get the WordPress API URL from your environment variables
  const wordpressApiUrl = process.env.WORDPRESS_API_URL;
  if (!wordpressApiUrl) {
    return res.status(500).json({ error: 'WORDPRESS_API_URL is not defined' });
  }

  try {
    const response = await fetch(
      `${wordpressApiUrl}/wp-json/custom/v1/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      }
    );

    if (!response.ok) {
      throw new Error('WordPress API error');
    }

    const result = await response.json();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending data to WordPress:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: 'Instagram access token is not defined in the environment variables',
    });
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Instagram API');
    }

    const data = await response.json();
    
    const limitedPosts = Array.isArray(data.data) ? data.data.slice(0, 4) : [];

    res.status(200).json({ data: limitedPosts });
  } catch (error) {
    console.error('Instagram API Error:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
}

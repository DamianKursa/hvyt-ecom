import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    console.warn('Warning: Instagram access token is not defined in the environment variables');
    return res.status(200).json({ data: [], warning: 'Instagram access token not configured' });
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`,
    );

    if (!response.ok) {
      console.warn('Warning: Failed to fetch from Instagram API, status:', response.status);
      return res.status(200).json({ data: [], warning: 'Failed to fetch Instagram posts' });
    }

    const data = await response.json();

    const limitedPosts = Array.isArray(data.data) ? data.data.slice(0, 4) : [];

    res.status(200).json({ data: limitedPosts });
  } catch (error) {
    console.warn('Instagram API Warning:', error);
    res.status(200).json({ data: [], warning: 'Failed to fetch Instagram posts' });
  }
}

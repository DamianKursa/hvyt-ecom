// pages/api/cache/flush.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCache, flushCache } from '../../../lib/cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { key, flushAll } = req.body;

  try {
    if (flushAll) {
      await flushCache();
      return res.status(200).json({ success: true, message: 'Cache flushed' });
    }
    if (!key) {
      return res.status(400).json({ error: 'Missing cache key' });
    }
    await deleteCache(key);
    return res.status(200).json({ success: true, message: `Cache key ${key} deleted` });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

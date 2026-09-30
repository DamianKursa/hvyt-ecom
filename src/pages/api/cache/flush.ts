// pages/api/cache/flush.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteCache,
  flushCache,
  resolveTargetCacheEnv,
  UnsupportedCacheEnvError,
} from '../../../lib/cache';

const firstParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};

const isFlushAll = (value: unknown): boolean =>
  value === true || value === 'true' || value === '1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const body =
    req.body && typeof req.body === 'object'
      ? (req.body as { key?: unknown; flushAll?: unknown; env?: unknown })
      : {};

  const key = String(body.key ?? firstParam(req.query.key) ?? '').trim();
  const flushAll = isFlushAll(body.flushAll) || isFlushAll(firstParam(req.query.flushAll));
  const requestedEnv = String(body.env ?? firstParam(req.query.env) ?? '').trim();

  try {
    const env = resolveTargetCacheEnv(requestedEnv);
    if (flushAll) {
      const deleted = await flushCache(env);
      return res.status(200).json({
        success: true,
        message: `Cache flushed for env "${env}"`,
        env,
        deleted,
      });
    }
    if (!key) {
      return res.status(400).json({
        error: 'Missing cache key. Pass key or flushAll=true, and optionally env=staging|prod.',
      });
    }
    const deleted = await deleteCache(key, env);
    return res.status(200).json({
      success: true,
      message: `Cache key ${key} deleted`,
      env,
      deleted,
    });
  } catch (error) {
    if (error instanceof UnsupportedCacheEnvError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error clearing cache:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('Missing REDIS_URL environment variable');
}

const redis = new Redis(process.env.REDIS_URL!);

const CACHE_KEY_PREFIX = 'hvyt';

const sanitizeCacheEnv = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'dev';

export const getCacheEnv = (): string => {
  if (process.env.CACHE_ENV?.trim()) {
    return sanitizeCacheEnv(process.env.CACHE_ENV);
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL_PL ||
    process.env.VERCEL_URL ||
    '';

  if (/staging/i.test(site)) {
    return 'staging';
  }

  if (process.env.VERCEL_ENV === 'preview') {
    const branch = process.env.VERCEL_GIT_COMMIT_REF;
    return sanitizeCacheEnv(branch ? `preview-${branch}` : 'preview');
  }

  if (
    process.env.VERCEL_ENV === 'production' ||
    /(?:^|\/\/)(?:www\.)?hvyt\.pl/i.test(site)
  ) {
    return 'prod';
  }

  return sanitizeCacheEnv(process.env.NODE_ENV || 'dev');
};

export const withCacheEnv = (key: string): string => {
  if (key.startsWith(`${CACHE_KEY_PREFIX}:`)) {
    return key;
  }
  return `${CACHE_KEY_PREFIX}:${getCacheEnv()}:${key}`;
};

export async function getCache(key: string): Promise<any> {
  const scopedKey = withCacheEnv(key);
  try {
    const data = await redis.get(scopedKey);
    if (data) {
      console.log(`[CACHE HIT] key: ${scopedKey}`);
      return JSON.parse(data);
    }
    console.log(`[CACHE MISS] key: ${scopedKey}`);
    return null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
}

export async function setCache(key: string, data: any, ttl: number): Promise<void> {
  const scopedKey = withCacheEnv(key);
  try {
    if (
      data === null ||
      data === undefined ||
      (typeof data === 'object' && 'error' in data)
    ) {
      console.warn(`[CACHE SKIP] Invalid or error response not cached. Key: ${scopedKey}`);
      return;
    }

    await redis.set(scopedKey, JSON.stringify(data), 'EX', ttl);
    console.log(`[CACHE SET] key: ${scopedKey} TTL: ${ttl}`);
  } catch (error) {
    console.error(`[CACHE ERROR] Failed to set cache for key ${scopedKey}:`, error);
  }
}

export async function deleteCache(key: string): Promise<number> {
  const scopedKey = withCacheEnv(key);
  try {
    const result = await redis.del(scopedKey);
    console.log(`[CACHE DELETE] key: ${scopedKey}`);
    return result;
  } catch (error) {
    console.error(`Error deleting cache key ${scopedKey}:`, error);
    throw error;
  }
}

/**
 * Delete only keys for the current environment (prod/staging/preview).
 */
export async function flushCache(): Promise<number> {
  const pattern = `${CACHE_KEY_PREFIX}:${getCacheEnv()}:*`;
  let cursor = '0';
  let deleted = 0;

  try {
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 200);
      cursor = nextCursor;
      if (keys.length > 0) {
        deleted += await redis.del(...keys);
      }
    } while (cursor !== '0');

    console.log(`[CACHE FLUSH] Removed ${deleted} keys matching ${pattern}`);
    return deleted;
  } catch (error) {
    console.error('Error flushing cache:', error);
    throw error;
  }
}

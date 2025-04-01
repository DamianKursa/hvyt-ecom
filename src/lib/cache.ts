// lib/cache.ts
import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL environment variable");
}

const redis = new Redis(process.env.REDIS_URL!);

export async function getCache(key: string): Promise<any> {
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`[CACHE HIT] key: ${key}`);
      return JSON.parse(data);
    }
    console.log(`[CACHE MISS] key: ${key}`);
    return null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
}

export async function setCache(key: string, data: any, ttl: number): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    console.log(`[CACHE SET] key: ${key} TTL: ${ttl}`);
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

/**
 * Delete a specific key from the cache.
 * Returns the number of keys that were removed.
 */
export async function deleteCache(key: string): Promise<number> {
  try {
    const result = await redis.del(key);
    console.log(`[CACHE DELETE] key: ${key}`);
    return result;
  } catch (error) {
    console.error(`Error deleting cache key ${key}:`, error);
    throw error;
  }
}

/**
 * Flush the entire Redis cache.
 * Use with caution since this removes all keys.
 */
export async function flushCache(): Promise<void> {
  try {
    await redis.flushdb();
    console.log('[CACHE FLUSH] All keys have been flushed.');
  } catch (error) {
    console.error('Error flushing cache:', error);
    throw error;
  }
}

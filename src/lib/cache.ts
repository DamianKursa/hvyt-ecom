// lib/cache.ts
import { kv } from '@vercel/kv';

export async function getCache(key: string): Promise<any> {
  try {
    const data = await kv.get(key);
    return data ? JSON.parse(data as string) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
}

export async function setCache(key: string, data: any, ttl: number): Promise<void> {
  try {
    // Use the "ex" option to set the TTL (in seconds)
    await kv.set(key, JSON.stringify(data), { ex: ttl });
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

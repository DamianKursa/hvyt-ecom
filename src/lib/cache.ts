import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL environment variable");
}

const redis = new Redis(process.env.REDIS_URL!); // The "!" tells TypeScript it's not undefined

export const getCache = async (key: string) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

export const setCache = async (key: string, data: any, ttl: number) => {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

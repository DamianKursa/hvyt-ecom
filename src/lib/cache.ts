import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

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

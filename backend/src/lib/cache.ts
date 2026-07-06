import { Redis } from 'ioredis';
import { redisConfig } from '../config/redis';

const redis = new Redis(redisConfig);

export async function getOrSetCache<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>,
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

export { redis };

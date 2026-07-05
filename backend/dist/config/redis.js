import { config } from '../config';
export const redisConfig = {
    host: new URL(config.redisUrl).hostname,
    port: parseInt(new URL(config.redisUrl).port || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined, // Jika ada password Redis
};

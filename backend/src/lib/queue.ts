import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis';

export const myQueue = new Queue('myQueue', {
  connection: redisConfig,
});

import { Worker, Job } from 'bullmq';
import { config } from './config';

console.log('Worker started!');

const connection = {
  host: new URL(config.redisUrl).hostname,
  port: parseInt(new URL(config.redisUrl).port || '6379', 10),
};

const worker = new Worker(
  'myQueue',
  async (job: Job) => {
    console.log(`Processing job ${job.id} with data ${JSON.stringify(job.data)}`);
    // Simulate a long-running task
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Job ${job.id} completed!`);
  },
  { connection },
);

worker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job?: Job, err?: Error) => {
  console.error(`Job ${job?.id} has failed with error ${err?.message}`);
});

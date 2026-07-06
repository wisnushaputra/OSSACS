import { Worker } from 'bullmq';
import { redisConfig } from './config/redis';
import { logger } from './lib/logger';
import { cleanDeviceParametersJob } from './modules/device-parameters/retention.job';
import { cleanOpticalHistoryJob } from './modules/optical-history/retention.job';
import { cleanNotificationHistoryJob } from './modules/notifications/retention.job'; // Import new job

const worker = new Worker(
  'myQueue',
  async (job) => {
    logger.info(`Processing job ${job.id}: ${job.name}`);

    switch (job.name) {
      case 'cleanDeviceParameters':
        await cleanDeviceParametersJob();
        break;
      case 'cleanOpticalHistory':
        await cleanOpticalHistoryJob();
        break;
      case 'cleanNotificationHistory':
        await cleanNotificationHistoryJob();
        break;
      default:
        logger.warn(`Unknown job: ${job.name}`);
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  {
    connection: redisConfig,
    // Adjust these options as needed for production
    concurrency: 5,
    limiter: {
      max: 1000,
      duration: 5000,
    },
  },
);

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} of type ${job.name} completed successfully.`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} of type ${job?.name} failed:`, err);
});

worker.on('error', (err) => {
  logger.error('Worker error:', err);
});

logger.info('BullMQ worker started.');

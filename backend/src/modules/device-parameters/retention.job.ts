import { db } from '../../db';
import { deviceParameters } from '../../db/schema';
import { config } from '../../config';
import { lt, sql } from 'drizzle-orm';
import { logger } from '../../lib/logger';

export const cleanDeviceParametersJob = async () => {
  const retentionDays = config.deviceParametersRetentionDays;
  if (retentionDays <= 0) {
    logger.info('Device parameters retention is disabled.');
    return;
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  logger.info(`Cleaning device parameters older than ${cutoffDate.toISOString()}`);

  try {
    const deletedRows = await db
      .delete(deviceParameters)
      .where(lt(deviceParameters.createdAt, cutoffDate))
      .returning({
        id: deviceParameters.id,
      });

    logger.info(`Deleted ${deletedRows.length} old device parameter records.`);
  } catch (error) {
    logger.error('Error cleaning device parameters: %s', String(error));
    throw error; // Re-throw to indicate job failure
  }
};

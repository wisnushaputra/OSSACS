import { db } from '../../db';
import { opticalHistory } from '../../db/schema';
import { config } from '../../config';
import { lt } from 'drizzle-orm';
import { logger } from '../../lib/logger';
export const cleanOpticalHistoryJob = async () => {
    const retentionDays = config.opticalHistoryRetentionDays;
    if (retentionDays <= 0) {
        logger.info('Optical history retention is disabled.');
        return;
    }
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    logger.info(`Cleaning optical history older than ${cutoffDate.toISOString()}`);
    try {
        const deletedRows = await db
            .delete(opticalHistory)
            .where(lt(opticalHistory.createdAt, cutoffDate))
            .returning({
            id: opticalHistory.id,
        });
        logger.info(`Deleted ${deletedRows.length} old optical history records.`);
    }
    catch (error) {
        logger.error('Error cleaning optical history: ' + (error instanceof Error ? error.message : String(error)));
        throw error; // Re-throw to indicate job failure
    }
};

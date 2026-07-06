import { db } from '../../db';
import { notifications } from '../../db/schema';
import { lt } from 'drizzle-orm';
import { logger } from '../../lib/logger';
export const cleanNotificationHistoryJob = async () => {
    // Let's assume we use the same config, or define a new one. Using optical history config for now as placeholder, 
    // or define a new one. I'll hardcode 90 days for now if no config exists.
    const retentionDays = 90; // Defaulting to 90
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    logger.info(`Cleaning notification history older than ${cutoffDate.toISOString()}`);
    try {
        const deletedRows = await db
            .delete(notifications)
            .where(lt(notifications.createdAt, cutoffDate))
            .returning({
            id: notifications.id,
        });
        logger.info(`Deleted ${deletedRows.length} old notification records.`);
    }
    catch (error) {
        logger.error('Error cleaning notification history: ' + (error instanceof Error ? error.message : String(error)));
        throw error;
    }
};

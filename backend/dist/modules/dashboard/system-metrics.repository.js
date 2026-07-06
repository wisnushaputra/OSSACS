import { db, pool } from '../../db';
import { systemMetrics } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { myQueue } from '../../lib/queue';
import { redis } from '../../lib/cache';
export class SystemMetricsRepository {
    async getLatestApiResponseTime() {
        const result = await db.query.systemMetrics.findFirst({
            where: eq(systemMetrics.name, 'API_RESPONSE_TIME'),
            orderBy: [desc(systemMetrics.createdAt)],
        });
        return result?.value ?? null;
    }
    async getQueueLength() {
        const counts = await myQueue.getJobCounts();
        return counts;
    }
    async getWorkerStatus() {
        const workers = await myQueue.getWorkers();
        return { active: workers.length > 0, count: workers.length };
    }
    async getRedisStatus() {
        try {
            const pong = await redis.ping();
            return pong === 'PONG' ? 'UP' : 'DOWN';
        }
        catch {
            return 'DOWN';
        }
    }
    async getPostgresStatus() {
        try {
            const client = await pool.connect();
            await client.query('SELECT 1');
            client.release();
            return 'UP';
        }
        catch {
            return 'DOWN';
        }
    }
}

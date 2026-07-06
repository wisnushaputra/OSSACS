import { db } from '../../db';
import { systemMetrics, metricNameEnum } from '../../db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
// import { myQueue } from '../../lib/queue'; // If queue length is needed

export class MetricsCollectorService {
  async recordMetric(name: typeof metricNameEnum.enumValues[number], value: number) {
    const [newMetric] = await db.insert(systemMetrics).values({ name, value }).returning();
    return newMetric;
  }

  async getMetricsHistory(name: typeof metricNameEnum.enumValues[number], startDate?: Date, endDate?: Date) {
    const whereConditions = [eq(systemMetrics.name, name)];

    if (startDate) {
      whereConditions.push(gte(systemMetrics.createdAt, startDate));
    }
    if (endDate) {
      whereConditions.push(lte(systemMetrics.createdAt, endDate));
    }

    return db.query.systemMetrics.findMany({
      where: and(...whereConditions),
      orderBy: [desc(systemMetrics.createdAt)],
      limit: 1000, // Reasonable limit for charting
    });
  }

  // Example of a periodic collection job
  async collectPeriodicMetrics() {
    // Collect Workflow Count
    // Collect Active Device Count
    // Collect Alarm Count
    // Collect Queue Length (e.g. await myQueue.getJobCounts())
    // Save to db using this.recordMetric(...)
    
    // Note: Implementing the actual collection logic depends on the specific modules
    // and would typically be called by a cron job or worker.
  }
}

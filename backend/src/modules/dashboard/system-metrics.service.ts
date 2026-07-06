import { SystemMetricsRepository } from './system-metrics.repository';

export class SystemMetricsService {
  constructor(private repo: SystemMetricsRepository) {}

  async getSystemMetrics() {
    const [apiResponseTime, queueLength, workerStatus, redisStatus, postgresStatus] =
      await Promise.all([
        this.repo.getLatestApiResponseTime(),
        this.repo.getQueueLength(),
        this.repo.getWorkerStatus(),
        this.repo.getRedisStatus(),
        this.repo.getPostgresStatus(),
      ]);

    return {
      apiResponseTime,
      queueLength,
      workerStatus,
      redisStatus,
      postgresStatus,
    };
  }
}

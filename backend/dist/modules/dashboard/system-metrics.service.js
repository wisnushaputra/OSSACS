export class SystemMetricsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getSystemMetrics() {
        const [apiResponseTime, queueLength, workerStatus, redisStatus, postgresStatus] = await Promise.all([
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

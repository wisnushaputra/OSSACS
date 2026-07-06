export class CustomerStatsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getStatusSummary(filters) {
        return this.repo.getStatusSummary(filters);
    }
    async getByRegion(filters) {
        return this.repo.getByRegion(filters);
    }
    async getByPop(filters) {
        return this.repo.getByPop(filters);
    }
    async getTrend(interval, filters) {
        return this.repo.getTrend(interval, filters);
    }
}

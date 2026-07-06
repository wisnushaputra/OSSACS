export class OltStatsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getHealthSummary(filters) {
        return this.repo.getHealthSummary(filters);
    }
    async getByVendor(filters) {
        return this.repo.getByVendor(filters);
    }
    async getPonPortUtilization(filters) {
        return this.repo.getPonPortUtilization(filters);
    }
    async getOnuCapacityUsage(filters) {
        return this.repo.getOnuCapacityUsage(filters);
    }
}

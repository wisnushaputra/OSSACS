export class OnuStatsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getOnlineOfflineLosDyingGaspCounts(filters) {
        return this.repo.getOnlineOfflineLosDyingGaspCounts(filters);
    }
    async getByVendor(filters) {
        return this.repo.getByVendor(filters);
    }
    async getByModel(filters) {
        return this.repo.getByModel(filters);
    }
    async getOpticalPowerDistribution(filters) {
        return this.repo.getOpticalPowerDistribution(filters);
    }
}

import { OnuStatsRepository } from './onu-stats.repository';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class OnuStatsService {
  constructor(private repo: OnuStatsRepository) {}

  async getOnlineOfflineLosDyingGaspCounts(filters: DashboardFilterParams) {
    return this.repo.getOnlineOfflineLosDyingGaspCounts(filters);
  }

  async getByVendor(filters: DashboardFilterParams) {
    return this.repo.getByVendor(filters);
  }

  async getByModel(filters: DashboardFilterParams) {
    return this.repo.getByModel(filters);
  }

  async getOpticalPowerDistribution(filters: DashboardFilterParams) {
    return this.repo.getOpticalPowerDistribution(filters);
  }
}

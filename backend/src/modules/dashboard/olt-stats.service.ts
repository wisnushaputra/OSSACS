import { OltStatsRepository } from './olt-stats.repository';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class OltStatsService {
  constructor(private repo: OltStatsRepository) {}

  async getHealthSummary(filters: DashboardFilterParams) {
    return this.repo.getHealthSummary(filters);
  }

  async getByVendor(filters: DashboardFilterParams) {
    return this.repo.getByVendor(filters);
  }

  async getPonPortUtilization(filters: DashboardFilterParams) {
    return this.repo.getPonPortUtilization(filters);
  }

  async getOnuCapacityUsage(filters: DashboardFilterParams) {
    return this.repo.getOnuCapacityUsage(filters);
  }
}

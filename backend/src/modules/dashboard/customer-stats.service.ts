import { CustomerStatsRepository } from './customer-stats.repository';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class CustomerStatsService {
  constructor(private repo: CustomerStatsRepository) {}

  async getStatusSummary(filters: DashboardFilterParams) {
    return this.repo.getStatusSummary(filters);
  }

  async getByRegion(filters: DashboardFilterParams) {
    return this.repo.getByRegion(filters);
  }

  async getByPop(filters: DashboardFilterParams) {
    return this.repo.getByPop(filters);
  }

  async getTrend(interval: 'day' | 'week' | 'month', filters: DashboardFilterParams) {
    return this.repo.getTrend(interval, filters);
  }
}

import { AlarmStatsRepository } from './alarm-stats.repository';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class AlarmStatsService {
  constructor(private repo: AlarmStatsRepository) {}

  async getActiveAlarmCounter(filters: DashboardFilterParams) {
    return this.repo.getActiveAlarmCounter(filters);
  }

  async getAlarmBySeverity(filters: DashboardFilterParams) {
    return this.repo.getAlarmBySeverity(filters);
  }

  async getAlarmTrend(interval: '24h' | '7d' | '30d' | 'all', filters: DashboardFilterParams) {
    return this.repo.getAlarmTrend(interval, filters);
  }

  async getLatestAlarmsTable(limit: number = 10, filters: DashboardFilterParams) {
    return this.repo.getLatestAlarmsTable(limit, filters);
  }
}

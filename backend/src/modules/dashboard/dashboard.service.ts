import { DashboardRepository } from './dashboard.repository';
import { getOrSetCache } from '../../lib/cache';
import { config } from '../../config';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class DashboardService {
  constructor(private dashboardRepository: DashboardRepository) {}

  async getDashboardSummary(filters: DashboardFilterParams) {
    const cacheKey = `dashboard:summary:${JSON.stringify(filters)}`; // Fix template literal here
    return getOrSetCache(cacheKey, config.dashboardSummaryCacheTtl, async () => {
      const [
        totalCustomers,
        totalOlts,
        totalOnus,
        onuStatusCounts,
        activeAlarms,
        runningWorkflows,
      ] = await Promise.all([
        this.dashboardRepository.getTotalCustomers(),
        this.dashboardRepository.getTotalOlts(),
        this.dashboardRepository.getTotalOnus(),
        this.dashboardRepository.getLatestOnuStatusCounts(filters),
        this.dashboardRepository.getActiveAlarmCount(filters),
        this.dashboardRepository.getRunningWorkflowCount(filters),
      ]);

      return {
        totalCustomers,
        totalOlts,
        totalOnus,
        onlineOnus: onuStatusCounts.ONLINE,
        offlineOnus: onuStatusCounts.OFFLINE,
        losOnus: onuStatusCounts.LOS,
        dyingGaspOnus: onuStatusCounts.DYING_GASP,
        activeAlarms,
        runningWorkflows,
      };
    });
  }
}

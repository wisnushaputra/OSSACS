import { DashboardRepository } from './dashboard.repository';
import { getOrSetCache } from '../../lib/cache';
import { config } from '../../config';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class DashboardService {
  constructor(private dashboardRepository: DashboardRepository) {}

  async getDashboardSummary(filters: DashboardFilterParams, userPermissions: string[]) {
    const cacheKey = `dashboard:summary:${JSON.stringify(filters)}:${JSON.stringify(userPermissions)}`;
    return getOrSetCache(cacheKey, config.dashboardSummaryCacheTtl, async () => {
      const [
        totalCustomers,
        totalOlts,
        totalOnus,
        onuStatusCounts,
        activeAlarms,
        runningWorkflows,
        oltHealthSummary,
        oltByVendor,
        ponPortUtilization,
        onuCapacityUsage,
      ] = await Promise.all([
        this.dashboardRepository.getTotalCustomers(),
        this.dashboardRepository.getTotalOlts(),
        this.dashboardRepository.getTotalOnus(),
        this.dashboardRepository.getLatestOnuStatusCounts(filters),
        this.dashboardRepository.getActiveAlarmCount(filters),
        this.dashboardRepository.getRunningWorkflowCount(filters),
        this.dashboardRepository.getOltHealthSummary(),
        this.dashboardRepository.getOltByVendor(),
        this.dashboardRepository.getPonPortUtilization(),
        this.dashboardRepository.getOnuCapacityUsage(),
      ]);

      const canViewOltHealthSummary = userPermissions.includes('dashboard:widget:olt-health');
      const canViewOltByVendor = userPermissions.includes('dashboard:widget:olt-vendor');
      const canViewPonPortUtilization = userPermissions.includes('dashboard:widget:pon-utilization');
      const canViewOnuCapacityUsage = userPermissions.includes('dashboard:widget:onu-capacity');

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
        oltHealthSummary: canViewOltHealthSummary ? oltHealthSummary : undefined,
        oltByVendor: canViewOltByVendor ? oltByVendor : undefined,
        ponPortUtilization: canViewPonPortUtilization ? ponPortUtilization : undefined,
        onuCapacityUsage: canViewOnuCapacityUsage ? onuCapacityUsage : undefined,
        permissions: {
          canViewOltHealthSummary,
          canViewOltByVendor,
          canViewPonPortUtilization,
          canViewOnuCapacityUsage,
        },
      };
    });
  }
}

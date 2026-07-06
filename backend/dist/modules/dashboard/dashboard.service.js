import { getOrSetCache } from '../../lib/cache';
import { config } from '../../config';
export class DashboardService {
    dashboardRepository;
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async getDashboardSummary(filters, userPermissions) {
        const cacheKey = `dashboard:summary:${JSON.stringify(filters)}:${JSON.stringify(userPermissions)}`;
        return getOrSetCache(cacheKey, config.dashboardSummaryCacheTtl, async () => {
            const [totalCustomers, totalOlts, totalOnus, onuStatusCounts, activeAlarms, runningWorkflows, oltHealthSummary, oltByVendor, ponPortUtilization, onuCapacityUsage,] = await Promise.all([
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

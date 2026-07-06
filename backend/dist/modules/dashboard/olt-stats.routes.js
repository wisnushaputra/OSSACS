import { OltStatsController } from './olt-stats.controller';
import { OltStatsRepository } from './olt-stats.repository';
import { OltStatsService } from './olt-stats.service';
import { dashboardSchemas } from './dashboard.schema';
export async function oltStatsRoutes(server) {
    const repo = new OltStatsRepository();
    const service = new OltStatsService(repo);
    const controller = new OltStatsController(service);
    server.get('/health', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getHealthSummary.bind(controller));
    server.get('/vendor', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getByVendor.bind(controller));
    server.get('/pon-utilization', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getPonPortUtilization.bind(controller));
    server.get('/capacity-usage', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getOnuCapacityUsage.bind(controller));
}

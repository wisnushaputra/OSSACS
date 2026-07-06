import { OnuStatsController } from './onu-stats.controller';
import { OnuStatsRepository } from './onu-stats.repository';
import { OnuStatsService } from './onu-stats.service';
import { dashboardSchemas } from './dashboard.schema';
export async function onuStatsRoutes(server) {
    const repo = new OnuStatsRepository();
    const service = new OnuStatsService(repo);
    const controller = new OnuStatsController(service);
    server.get('/status', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getOnlineOfflineLosDyingGaspCounts.bind(controller));
    server.get('/vendor', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getByVendor.bind(controller));
    server.get('/model', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getByModel.bind(controller));
    server.get('/optical-power-distribution', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getOpticalPowerDistribution.bind(controller));
}

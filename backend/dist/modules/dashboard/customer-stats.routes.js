import { CustomerStatsController } from './customer-stats.controller';
import { CustomerStatsRepository } from './customer-stats.repository';
import { CustomerStatsService } from './customer-stats.service';
import { dashboardSchemas } from './dashboard.schema';
export async function customerStatsRoutes(server) {
    const repo = new CustomerStatsRepository();
    const service = new CustomerStatsService(repo);
    const controller = new CustomerStatsController(service);
    server.get('/status', {
        preHandler: [server.authenticate],
        schema: {
            querystring: dashboardSchemas.dashboardFilterQuerySchema,
        },
    }, controller.getStatusSummary.bind(controller));
    server.get('/region', {
        preHandler: [server.authenticate],
        schema: {
            querystring: dashboardSchemas.dashboardFilterQuerySchema,
        },
    }, controller.getByRegion.bind(controller));
    server.get('/pop', {
        preHandler: [server.authenticate],
        schema: {
            querystring: dashboardSchemas.dashboardFilterQuerySchema,
        },
    }, controller.getByPop.bind(controller));
    server.get('/trend', {
        preHandler: [server.authenticate],
        schema: {
            querystring: dashboardSchemas.dashboardFilterQuerySchema.and(dashboardSchemas.timeRangeQuerySchema),
        },
    }, controller.getTrend.bind(controller));
}

import { AlarmStatsController } from './alarm-stats.controller';
import { AlarmStatsRepository } from './alarm-stats.repository';
import { AlarmStatsService } from './alarm-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';
export async function alarmStatsRoutes(server) {
    const repo = new AlarmStatsRepository();
    const service = new AlarmStatsService(repo);
    const controller = new AlarmStatsController(service);
    server.get('/active', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getActiveAlarmCounter.bind(controller));
    server.get('/by-severity', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    }, controller.getAlarmBySeverity.bind(controller));
    server.get('/trend', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema.and(dashboardSchemas.timeRangeQuerySchema) },
    }, controller.getAlarmTrend.bind(controller));
    server.get('/latest', {
        preHandler: [server.authenticate],
        schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema.extend({ limit: z.coerce.number().optional() }) },
    }, controller.getLatestAlarmTable.bind(controller));
}

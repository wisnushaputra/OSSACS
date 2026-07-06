import { FastifyInstance } from 'fastify';
import { AlarmStatsController } from './alarm-stats.controller';
import { AlarmStatsRepository } from './alarm-stats.repository';
import { AlarmStatsService } from './alarm-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

export async function alarmStatsRoutes(server: FastifyInstance) {
  const repo = new AlarmStatsRepository();
  const service = new AlarmStatsService(repo);
  const controller = new AlarmStatsController(service);

  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/active',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getActiveAlarmCounter.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/by-severity',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getAlarmBySeverity.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> & z.infer<typeof dashboardSchemas.timeRangeQuerySchema> }>(
    '/trend',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema.and(dashboardSchemas.timeRangeQuerySchema) },
    },
    controller.getAlarmTrend.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> & { limit?: number } }>(
    '/latest',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema.extend({ limit: z.coerce.number().optional() }) },
    },
    controller.getLatestAlarmTable.bind(controller)
  );
}

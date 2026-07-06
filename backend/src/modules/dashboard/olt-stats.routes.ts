import { FastifyInstance } from 'fastify';
import { OltStatsController } from './olt-stats.controller';
import { OltStatsRepository } from './olt-stats.repository';
import { OltStatsService } from './olt-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

export async function oltStatsRoutes(server: FastifyInstance) {
  const repo = new OltStatsRepository();
  const service = new OltStatsService(repo);
  const controller = new OltStatsController(service);

  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/health',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getHealthSummary.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/vendor',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getByVendor.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/pon-utilization',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getPonPortUtilization.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/capacity-usage',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getOnuCapacityUsage.bind(controller)
  );
}

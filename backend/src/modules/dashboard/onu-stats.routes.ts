import { FastifyInstance } from 'fastify';
import { OnuStatsController } from './onu-stats.controller';
import { OnuStatsRepository } from './onu-stats.repository';
import { OnuStatsService } from './onu-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

export async function onuStatsRoutes(server: FastifyInstance) {
  const repo = new OnuStatsRepository();
  const service = new OnuStatsService(repo);
  const controller = new OnuStatsController(service);

  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/status',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getOnlineOfflineLosDyingGaspCounts.bind(controller)
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
    '/model',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getByModel.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/optical-power-distribution',
    {
      preHandler: [server.authenticate],
      schema: { querystring: dashboardSchemas.dashboardFilterQuerySchema },
    },
    controller.getOpticalPowerDistribution.bind(controller)
  );
}

import { FastifyInstance } from 'fastify';
import { CustomerStatsController } from './customer-stats.controller';
import { CustomerStatsRepository } from './customer-stats.repository';
import { CustomerStatsService } from './customer-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

export async function customerStatsRoutes(server: FastifyInstance) {
  const repo = new CustomerStatsRepository();
  const service = new CustomerStatsService(repo);
  const controller = new CustomerStatsController(service);

  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/status',
    {
      preHandler: [server.authenticate],
      schema: {
        querystring: dashboardSchemas.dashboardFilterQuerySchema,
      },
    },
    controller.getStatusSummary.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/region',
    {
      preHandler: [server.authenticate],
      schema: {
        querystring: dashboardSchemas.dashboardFilterQuerySchema,
      },
    },
    controller.getByRegion.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> }>(
    '/pop',
    {
      preHandler: [server.authenticate],
      schema: {
        querystring: dashboardSchemas.dashboardFilterQuerySchema,
      },
    },
    controller.getByPop.bind(controller)
  );
  server.get<{ Querystring: z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema> & z.infer<typeof dashboardSchemas.timeRangeQuerySchema> }>(
    '/trend',
    {
      preHandler: [server.authenticate],
      schema: {
        querystring: dashboardSchemas.dashboardFilterQuerySchema.and(dashboardSchemas.timeRangeQuerySchema),
      },
    },
    controller.getTrend.bind(controller)
  );
}

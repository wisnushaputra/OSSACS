import { FastifyInstance } from 'fastify';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';
import { dashboardSchemas, DashboardFilterParams } from './dashboard.schema';

export async function dashboardRoutes(server: FastifyInstance) {
  const dashboardRepository = new DashboardRepository();
  const dashboardService = new DashboardService(dashboardRepository);
  const dashboardController = new DashboardController(dashboardService);

  server.get<{ Querystring: DashboardFilterParams }>(
    '/summary',
    {
      preHandler: [server.authenticate, server.authorize(['dashboard:read'])],
      schema: {
        querystring: dashboardSchemas.dashboardFilterQuerySchema,
        response: { 200: dashboardSchemas.dashboardSummaryResponseSchema },
      },
    },
    dashboardController.getDashboardSummary.bind(dashboardController),
  );
}

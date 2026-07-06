import { FastifyReply, FastifyRequest } from 'fastify';
import { DashboardService } from './dashboard.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  async getDashboardSummary(request: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const summary = await this.dashboardService.getDashboardSummary(request.query);
    return reply.send({ success: true, data: summary });
  }
}

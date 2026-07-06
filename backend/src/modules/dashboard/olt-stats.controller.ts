import { FastifyReply, FastifyRequest } from 'fastify';
import { OltStatsService } from './olt-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class OltStatsController {
  constructor(private service: OltStatsService) {}

  async getHealthSummary(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getHealthSummary(req.query);
    return reply.send({ success: true, data });
  }

  async getByVendor(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getByVendor(req.query);
    return reply.send({ success: true, data });
  }

  async getPonPortUtilization(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getPonPortUtilization(req.query);
    return reply.send({ success: true, data });
  }

  async getOnuCapacityUsage(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getOnuCapacityUsage(req.query);
    return reply.send({ success: true, data });
  }
}

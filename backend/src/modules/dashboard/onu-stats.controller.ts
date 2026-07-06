import { FastifyReply, FastifyRequest } from 'fastify';
import { OnuStatsService } from './onu-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class OnuStatsController {
  constructor(private service: OnuStatsService) {}

  async getOnlineOfflineLosDyingGaspCounts(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getOnlineOfflineLosDyingGaspCounts(req.query);
    return reply.send({ success: true, data });
  }

  async getByVendor(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getByVendor(req.query);
    return reply.send({ success: true, data });
  }

  async getByModel(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getByModel(req.query);
    return reply.send({ success: true, data });
  }

  async getOpticalPowerDistribution(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getOpticalPowerDistribution(req.query);
    return reply.send({ success: true, data });
  }
}

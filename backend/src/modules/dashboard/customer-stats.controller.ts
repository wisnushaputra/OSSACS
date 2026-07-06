import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomerStatsService } from './customer-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class CustomerStatsController {
  constructor(private service: CustomerStatsService) {}

  async getStatusSummary(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getStatusSummary(req.query);
    return reply.send({ success: true, data });
  }

  async getByRegion(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getByRegion(req.query);
    return reply.send({ success: true, data });
  }

  async getByPop(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getByPop(req.query);
    return reply.send({ success: true, data });
  }

  async getTrend(
    req: FastifyRequest<{ Querystring: DashboardFilterParams & { interval?: 'day' | 'week' | 'month' | '24h' | '7d' | '30d' | 'all' } }>,
    reply: FastifyReply
  ) {
    const { interval, ...filters } = req.query;
    // Map interval from routes to valid trend intervals
    let mappedInterval: 'day' | 'week' | 'month' = 'day';
    if (interval === 'week' || interval === '7d') {
      mappedInterval = 'week';
    } else if (interval === 'month' || interval === '30d' || interval === 'all') {
      mappedInterval = 'month';
    }
    const data = await this.service.getTrend(mappedInterval, filters);
    return reply.send({ success: true, data });
  }
}

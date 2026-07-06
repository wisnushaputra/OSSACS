import { FastifyReply, FastifyRequest } from 'fastify';
import { AlarmStatsService } from './alarm-stats.service';
import { dashboardSchemas } from './dashboard.schema';
import { z } from 'zod';

type DashboardFilterParams = z.infer<typeof dashboardSchemas.dashboardFilterQuerySchema>;

export class AlarmStatsController {
  constructor(private service: AlarmStatsService) {}

  async getActiveAlarmCounter(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getActiveAlarmCounter(req.query);
    return reply.send({ success: true, data });
  }

  async getAlarmBySeverity(req: FastifyRequest<{ Querystring: DashboardFilterParams }>, reply: FastifyReply) {
    const data = await this.service.getAlarmBySeverity(req.query);
    return reply.send({ success: true, data });
  }

  async getAlarmTrend(req: FastifyRequest<{ Querystring: DashboardFilterParams & { interval?: '24h' | '7d' | '30d' | 'all' } }>, reply: FastifyReply) {
    const { interval, ...filters } = req.query;
    const data = await this.service.getAlarmTrend(interval || '24h', filters);
    return reply.send({ success: true, data });
  }

  async getLatestAlarmTable(req: FastifyRequest<{ Querystring: DashboardFilterParams & { limit?: number } }>, reply: FastifyReply) {
    const { limit, ...filters } = req.query;
    const data = await this.service.getLatestAlarmsTable(limit, filters);
    return reply.send({ success: true, data });
  }
}

import { FastifyReply, FastifyRequest } from 'fastify';
import { SystemMetricsService } from './system-metrics.service';

export class SystemMetricsController {
  constructor(private service: SystemMetricsService) {}

  async getSystemMetrics(req: FastifyRequest, reply: FastifyReply) {
    const data = await this.service.getSystemMetrics();
    return reply.send({ success: true, data });
  }
}

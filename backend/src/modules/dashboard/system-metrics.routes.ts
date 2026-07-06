import { FastifyInstance } from 'fastify';
import { SystemMetricsController } from './system-metrics.controller';
import { SystemMetricsRepository } from './system-metrics.repository';
import { SystemMetricsService } from './system-metrics.service';

export async function systemMetricsRoutes(server: FastifyInstance) {
  const repo = new SystemMetricsRepository();
  const service = new SystemMetricsService(repo);
  const controller = new SystemMetricsController(service);

  server.get('/', { preHandler: [server.authenticate] }, controller.getSystemMetrics.bind(controller));
}

import { FastifyInstance } from 'fastify';
import { WorkflowStatsController } from './workflow-stats.controller';
import { WorkflowStatsRepository } from './workflow-stats.repository';
import { WorkflowStatsService } from './workflow-stats.service';

export async function workflowStatsRoutes(server: FastifyInstance) {
  const repo = new WorkflowStatsRepository();
  const service = new WorkflowStatsService(repo);
  const controller = new WorkflowStatsController(service);

  server.get(
    '/',
    { preHandler: [server.authenticate] },
    controller.getWorkflowStats.bind(controller)
  );

  server.get<{ Querystring: { limit?: number } }>(
    '/latest',
    { preHandler: [server.authenticate] },
    controller.getLatestWorkflows.bind(controller)
  );
}

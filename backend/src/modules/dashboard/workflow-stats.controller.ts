import { FastifyReply, FastifyRequest } from 'fastify';
import { WorkflowStatsService } from './workflow-stats.service';

export class WorkflowStatsController {
  constructor(private service: WorkflowStatsService) {}

  async getWorkflowStats(req: FastifyRequest, reply: FastifyReply) {
    const data = await this.service.getWorkflowStats();
    return reply.send({ success: true, data });
  }

  async getLatestWorkflows(req: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) {
    const limit = req.query.limit ?? 10;
    const data = await this.service.getLatestWorkflows(limit);
    return reply.send({ success: true, data });
  }
}

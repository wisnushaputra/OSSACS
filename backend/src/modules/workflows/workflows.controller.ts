import { FastifyReply, FastifyRequest } from 'fastify';
import { WorkflowService } from './workflows.service';
import { workflowSchemas, WorkflowSearchQuery } from './workflows.schema';
import { z } from 'zod';

export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  async getWorkflow(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const workflow = await this.workflowService.getWorkflow(request.params.id);
    return reply.send({ success: true, data: workflow });
  }

  async searchWorkflows(
    request: FastifyRequest<{ Querystring: z.infer<typeof workflowSchemas.workflowSearchQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const workflows = await this.workflowService.searchWorkflows(request.query);
    return reply.send({ success: true, data: workflows });
  }
}

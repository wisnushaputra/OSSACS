import { FastifyInstance } from 'fastify';
import { WorkflowController } from './workflow.controller';
import { WorkflowRepository } from './workflow.repository';
import { WorkflowService } from './workflow.service';
import { workflowSchemas } from './workflows.schema';
import { z } from 'zod';

export async function workflowRoutes(server: FastifyInstance) {
  const workflowRepository = new WorkflowRepository();
  const workflowService = new WorkflowService(workflowRepository);
  const workflowController = new WorkflowController(workflowService);

  // Search Workflows (GET /api/v1/workflows)
  server.get<{
    Querystring: z.infer<typeof workflowSchemas.workflowSearchQuerySchema>;
    Reply: typeof workflowSchemas.workflowsPaginatedApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['workflow:read'])],
      schema: {
        querystring: workflowSchemas.workflowSearchQuerySchema,
        response: { 200: workflowSchemas.workflowsPaginatedApiResponseSchema },
      },
    },
    workflowController.searchWorkflows.bind(workflowController),
  );

  // Get Workflow by ID (GET /api/v1/workflows/:id)
  server.get<{
    Params: z.infer<typeof z.object({ id: z.string().uuid() })>;
    Reply: typeof workflowSchemas.workflowApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['workflow:read'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: workflowSchemas.workflowApiResponseSchema },
      },
    },
    workflowController.getWorkflow.bind(workflowController),
  );
}
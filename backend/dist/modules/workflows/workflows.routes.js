import { WorkflowController } from './workflows.controller';
import { WorkflowRepository } from './workflows.repository';
import { WorkflowService } from './workflows.service';
import { workflowSchemas } from './workflows.schema';
import { z } from 'zod';
const idParamsSchema = z.object({ id: z.string().uuid() });
export async function workflowRoutes(server) {
    const workflowRepository = new WorkflowRepository();
    const workflowService = new WorkflowService(workflowRepository);
    const workflowController = new WorkflowController(workflowService);
    // Search Workflows (GET /api/v1/workflows)
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['workflow:read'])],
        schema: {
            querystring: workflowSchemas.workflowSearchQuerySchema,
            response: { 200: workflowSchemas.workflowsPaginatedApiResponseSchema },
        },
    }, workflowController.searchWorkflows.bind(workflowController));
    // Get Workflow by ID (GET /api/v1/workflows/:id)
    server.get('/:id', {
        preHandler: [server.authenticate, server.authorize(['workflow:read'])],
        schema: {
            params: idParamsSchema,
            response: { 200: workflowSchemas.workflowApiResponseSchema },
        },
    }, workflowController.getWorkflow.bind(workflowController));
}

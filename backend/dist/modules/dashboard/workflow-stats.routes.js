import { WorkflowStatsController } from './workflow-stats.controller';
import { WorkflowStatsRepository } from './workflow-stats.repository';
import { WorkflowStatsService } from './workflow-stats.service';
export async function workflowStatsRoutes(server) {
    const repo = new WorkflowStatsRepository();
    const service = new WorkflowStatsService(repo);
    const controller = new WorkflowStatsController(service);
    server.get('/', { preHandler: [server.authenticate] }, controller.getWorkflowStats.bind(controller));
    server.get('/latest', { preHandler: [server.authenticate] }, controller.getLatestWorkflows.bind(controller));
}

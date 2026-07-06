export class WorkflowController {
    workflowService;
    constructor(workflowService) {
        this.workflowService = workflowService;
    }
    async getWorkflow(request, reply) {
        const workflow = await this.workflowService.getWorkflow(request.params.id);
        return reply.send({ success: true, data: workflow });
    }
    async searchWorkflows(request, reply) {
        const workflows = await this.workflowService.searchWorkflows(request.query);
        return reply.send({ success: true, data: workflows });
    }
}

export class WorkflowStatsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getWorkflowStats(req, reply) {
        const data = await this.service.getWorkflowStats();
        return reply.send({ success: true, data });
    }
    async getLatestWorkflows(req, reply) {
        const limit = req.query.limit ?? 10;
        const data = await this.service.getLatestWorkflows(limit);
        return reply.send({ success: true, data });
    }
}

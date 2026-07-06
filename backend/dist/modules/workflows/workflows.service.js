import { NotFoundError } from '../../lib/errors';
export class WorkflowService {
    workflowRepository;
    constructor(workflowRepository) {
        this.workflowRepository = workflowRepository;
    }
    async getWorkflow(id) {
        const workflow = await this.workflowRepository.findById(id);
        if (!workflow) {
            throw new NotFoundError('Workflow');
        }
        return workflow;
    }
    async searchWorkflows(params) {
        return this.workflowRepository.search(params);
    }
}

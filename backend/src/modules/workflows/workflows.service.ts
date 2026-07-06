import { WorkflowRepository } from './workflows.repository';
import { WorkflowSearchQuery } from './workflows.schema';
import { NotFoundError } from '../../lib/errors';

export class WorkflowService {
  constructor(private workflowRepository: WorkflowRepository) {}

  async getWorkflow(id: string) {
    const workflow = await this.workflowRepository.findById(id);
    if (!workflow) {
      throw new NotFoundError('Workflow');
    }
    return workflow;
  }

  async searchWorkflows(params: WorkflowSearchQuery) {
    return this.workflowRepository.search(params);
  }
}

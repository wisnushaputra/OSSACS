import { WorkflowStatsRepository } from './workflow-stats.repository';

export class WorkflowStatsService {
  constructor(private repo: WorkflowStatsRepository) {}

  async getWorkflowStats() {
    const counts = await this.repo.getWorkflowStatusCounts();
    
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let failed = 0;
    let cancelled = 0;

    counts.forEach((item) => {
      if (item.status === 'PENDING') pending = Number(item.count);
      else if (item.status === 'IN_PROGRESS') inProgress = Number(item.count);
      else if (item.status === 'COMPLETED') completed = Number(item.count);
      else if (item.status === 'FAILED') failed = Number(item.count);
      else if (item.status === 'CANCELLED') cancelled = Number(item.count);
    });

    const total = pending + inProgress + completed + failed + cancelled;
    const finishedTotal = completed + failed + cancelled;

    const successRate = finishedTotal > 0 ? (completed / finishedTotal) * 100 : 0;
    const failureRate = finishedTotal > 0 ? (failed / finishedTotal) * 100 : 0;

    return {
      running: inProgress,
      pending,
      inProgress,
      completed,
      failed,
      cancelled,
      total,
      successRate: Math.round(successRate * 100) / 100,
      failureRate: Math.round(failureRate * 100) / 100,
    };
  }

  async getLatestWorkflows(limit: number = 10) {
    return this.repo.getLatestWorkflows(limit);
  }
}

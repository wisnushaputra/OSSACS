import { db } from '../../db';
import { workflows } from '../../db/schema';
import { desc, count } from 'drizzle-orm';
export class WorkflowStatsRepository {
    async getWorkflowStatusCounts() {
        return db
            .select({
            status: workflows.status,
            count: count(),
        })
            .from(workflows)
            .groupBy(workflows.status)
            .execute();
    }
    async getLatestWorkflows(limit = 10) {
        return db
            .select()
            .from(workflows)
            .orderBy(desc(workflows.startedAt))
            .limit(limit)
            .execute();
    }
}

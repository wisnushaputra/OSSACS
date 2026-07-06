import { db } from '../../db';
import { workflows, workflowSteps } from '../../db/schema';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
import { WorkflowSearchQuery } from './workflows.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class WorkflowRepository {
  async findById(id: string) {
    return db.query.workflows.findFirst({
      where: eq(workflows.id, id),
      with: {
        steps: {
          orderBy: [desc(workflowSteps.createdAt)],
        },
      },
    });
  }

  async search(params: WorkflowSearchQuery): Promise<PaginatedResult<typeof workflows.$inferSelect>> {
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;

    const whereConditions = [];

    if (params.onuId) {
      whereConditions.push(eq(workflows.onuId, params.onuId));
    }
    if (params.customerId) {
      whereConditions.push(eq(workflows.customerId, params.customerId));
    }
    if (params.oltId) {
      whereConditions.push(eq(workflows.oltId, params.oltId));
    }
    if (params.status) {
      whereConditions.push(eq(workflows.status, params.status));
    }
    if (params.startDate) {
      whereConditions.push(gte(workflows.startedAt, new Date(params.startDate)));
    }
    if (params.endDate) {
      whereConditions.push(lte(workflows.startedAt, new Date(params.endDate)));
    }

    const data = await db.query.workflows.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(workflows.startedAt)],
      limit,
      offset,
      with: {
        steps: true,
      },
    });

    const totalResult = await db
      .select({ count: count(workflows.id) })
      .from(workflows)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .execute();

    const total = Number(totalResult[0]?.count ?? 0);

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  async createWorkflow(data: Omit<typeof workflows.$inferInsert, 'id' | 'startedAt' | 'updatedAt'>) {
    const [newWorkflow] = await db.insert(workflows).values(data).returning();
    return newWorkflow;
  }

  async updateWorkflow(id: string, data: Partial<typeof workflows.$inferInsert>) {
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return updatedWorkflow;
  }

  async createStep(data: Omit<typeof workflowSteps.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const [newStep] = await db.insert(workflowSteps).values(data).returning();
    return newStep;
  }

  async updateStep(id: string, data: Partial<typeof workflowSteps.$inferInsert>) {
    const [updatedStep] = await db
      .update(workflowSteps)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workflowSteps.id, id))
      .returning();
    return updatedStep;
  }
}

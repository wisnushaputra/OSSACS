import { db } from '../../db';
import { eventLogs } from '../../db/schema/eventLogs';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
import { CreateEventLogInput, EventSearchQuery } from './events.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class EventRepository {
  async create(data: CreateEventLogInput) {
    const [newEvent] = await db.insert(eventLogs).values(data).returning();
    return newEvent;
  }

  async search(params: EventSearchQuery): Promise<PaginatedResult<typeof eventLogs.$inferSelect>> {
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;

    const whereConditions = [];

    if (params.customerId) {
      whereConditions.push(eq(eventLogs.customerId, params.customerId));
    }
    if (params.onuId) {
      whereConditions.push(eq(eventLogs.onuId, params.onuId));
    }
    if (params.oltId) {
      whereConditions.push(eq(eventLogs.oltId, params.oltId));
    }
    if (params.workflowId) {
      whereConditions.push(eq(eventLogs.workflowId, params.workflowId));
    }
    if (params.eventType) {
      whereConditions.push(eq(eventLogs.eventType, params.eventType));
    }
    if (params.startDate) {
      whereConditions.push(gte(eventLogs.createdAt, new Date(params.startDate)));
    }
    if (params.endDate) {
      whereConditions.push(lte(eventLogs.createdAt, new Date(params.endDate)));
    }

    const data = await db.query.eventLogs.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(eventLogs.createdAt)],
      limit,
      offset,
    });

    const totalResult = await db
      .select({ count: count(eventLogs.id) })
      .from(eventLogs)
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
}

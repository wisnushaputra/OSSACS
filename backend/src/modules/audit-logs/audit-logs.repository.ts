import { db } from '../../db';
import { auditLogs } from '../../db/schema';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
import { AuditLogSearchQuery, CreateAuditLogInput } from './audit-logs.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class AuditLogRepository {
  async search(params: AuditLogSearchQuery): Promise<PaginatedResult<typeof auditLogs.$inferSelect>> {
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;

    const whereConditions = [];

    if (params.userId) {
      whereConditions.push(eq(auditLogs.userId, params.userId));
    }
    if (params.entity) {
      whereConditions.push(eq(auditLogs.entity, params.entity));
    }
    if (params.action) {
      whereConditions.push(eq(auditLogs.action, params.action));
    }
    if (params.ipAddress) {
      whereConditions.push(eq(auditLogs.ipAddress, params.ipAddress));
    }
    if (params.startDate) {
      whereConditions.push(gte(auditLogs.createdAt, new Date(params.startDate)));
    }
    if (params.endDate) {
      whereConditions.push(lte(auditLogs.createdAt, new Date(params.endDate)));
    }

    const data = await db.query.auditLogs.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(auditLogs.createdAt)],
      limit,
      offset,
    });

    const totalResult = await db
      .select({ count: count(auditLogs.id) })
      .from(auditLogs)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .execute();

    const total = Number(totalResult[0]?.count ?? 0);

    return {
      data: data as any,
      total,
      limit,
      offset,
    };
  }

  async create(data: CreateAuditLogInput) {
    const [newLog] = await db.insert(auditLogs).values(data).returning();
    return newLog;
  }
}

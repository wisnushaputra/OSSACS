import { db } from '../../db';
import { alarms } from '../../db/schema';
import { eq, and, gte, lte, isNull, isNotNull, desc, count } from 'drizzle-orm';

export interface AlarmSearchParams {
  onuId?: string;
  type?: 'LOS' | 'DYING_GASP' | 'OPTICAL_LOW' | 'ONU_OFFLINE' | 'ONU_ONLINE' | 'POWER_FAILURE';
  severity?: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING' | 'INFO';
  isResolved?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class AlarmRepository {
  async findById(id: string) {
    return db.query.alarms.findFirst({
      where: eq(alarms.id, id),
    });
  }

  async create(data: Omit<typeof alarms.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const [newAlarm] = await db.insert(alarms).values(data).returning();
    return newAlarm;
  }

  async update(id: string, data: Partial<typeof alarms.$inferInsert>) {
    const [updatedAlarm] = await db
      .update(alarms)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(alarms.id, id))
      .returning();
    return updatedAlarm;
  }

  async delete(id: string) {
    const [deletedAlarm] = await db.delete(alarms).where(eq(alarms.id, id)).returning();
    return deletedAlarm;
  }

  async acknowledge(id: string) {
    const [updatedAlarm] = await db
      .update(alarms)
      .set({ acknowledgedAt: new Date(), updatedAt: new Date() })
      .where(eq(alarms.id, id))
      .returning();
    return updatedAlarm;
  }

  async resolve(id: string) {
    const [updatedAlarm] = await db
      .update(alarms)
      .set({ resolvedAt: new Date(), updatedAt: new Date() })
      .where(eq(alarms.id, id))
      .returning();
    return updatedAlarm;
  }

  async search(params: AlarmSearchParams): Promise<PaginatedResult<typeof alarms.$inferSelect>> {
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;

    const whereConditions = [];

    if (params.onuId) {
      whereConditions.push(eq(alarms.onuId, params.onuId));
    }
    if (params.type) {
      whereConditions.push(eq(alarms.type, params.type));
    }
    if (params.severity) {
      whereConditions.push(eq(alarms.severity, params.severity));
    }
    if (params.isResolved !== undefined) {
      if (params.isResolved) {
        whereConditions.push(isNotNull(alarms.resolvedAt));
      } else {
        whereConditions.push(isNull(alarms.resolvedAt));
      }
    }
    if (params.startDate) {
      whereConditions.push(gte(alarms.createdAt, params.startDate));
    }
    if (params.endDate) {
      whereConditions.push(lte(alarms.createdAt, params.endDate));
    }

    const data = await db.query.alarms.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(alarms.createdAt)],
      limit,
      offset,
    });

    const totalResult = await db
      .select({ count: count(alarms.id) })
      .from(alarms)
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
}

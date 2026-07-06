import { db } from '../../db';
import { opticalHistory } from '../../db/schema';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
// import { OpticalHistorySearchQuery } from './optical-history.schema'; // Remove this import

export interface OpticalHistorySearchParams {
  onuId?: string;
  startDate?: Date; // Changed to Date
  endDate?: Date;   // Changed to Date
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class OpticalHistoryRepository {
  async search(params: OpticalHistorySearchParams): Promise<PaginatedResult<typeof opticalHistory.$inferSelect>> {
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;

    const whereConditions = [];

    if (params.onuId) {
      whereConditions.push(eq(opticalHistory.onuId, params.onuId));
    }
    if (params.startDate) {
      whereConditions.push(gte(opticalHistory.createdAt, params.startDate)); // Use Date directly
    }
    if (params.endDate) {
      whereConditions.push(lte(opticalHistory.createdAt, params.endDate));   // Use Date directly
    }

    const data = await db.query.opticalHistory.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(opticalHistory.createdAt)],
      limit,
      offset,
    });

    const totalResult = await db
      .select({ count: count(opticalHistory.id) })
      .from(opticalHistory)
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

  async create(data: Omit<typeof opticalHistory.$inferInsert, 'id' | 'createdAt'>) {
    const [newRecord] = await db.insert(opticalHistory).values(data).returning();
    return newRecord;
  }
}

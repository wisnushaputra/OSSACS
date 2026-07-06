import { db } from '../../db';
import { deviceParameters } from '../../db/schema';
import { eq, desc, and, gte, lte, count } from 'drizzle-orm';

export interface DeviceParameterSearchParams {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class DeviceParameterRepository {
  async getLatestParameters(onuId: string) {
    return db.query.deviceParameters.findFirst({
      where: eq(deviceParameters.onuId, onuId),
      orderBy: [desc(deviceParameters.createdAt)],
    });
  }

  async getHistory(
    onuId: string,
    params?: DeviceParameterSearchParams,
  ): Promise<PaginatedResult<typeof deviceParameters.$inferSelect>> {
    const limit = params?.limit ?? 10;
    const offset = params?.offset ?? 0;

    const whereConditions = [eq(deviceParameters.onuId, onuId)];

    if (params?.startDate) {
      whereConditions.push(gte(deviceParameters.createdAt, params.startDate));
    }
    if (params?.endDate) {
      whereConditions.push(lte(deviceParameters.createdAt, params.endDate));
    }

    const data = await db.query.deviceParameters.findMany({
      where: and(...whereConditions),
      orderBy: [desc(deviceParameters.createdAt)],
      limit,
      offset,
    });

    const totalResult = await db
      .select({ count: count(deviceParameters.id) })
      .from(deviceParameters)
      .where(and(...whereConditions))
      .execute();

    const total = Number(totalResult[0]?.count ?? 0);

    return {
      data: data as any,
      total,
      limit,
      offset,
    };
  }

  async create(data: Omit<typeof deviceParameters.$inferInsert, 'id' | 'createdAt'>) {
    const [newParameters] = await db
      .insert(deviceParameters)
      .values(data)
      .returning();
    return newParameters;
  }
}

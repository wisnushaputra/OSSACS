import { db } from '../../db';
import { ponPorts, onus } from '../../db/schema';
import { eq, and, sql, count } from 'drizzle-orm';
import { UpdatePonPortInput } from './pon-port.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class PonPortRepository {
  async findById(id: string) {
    // Select with activeOnus counted from onus table
    const result = await db
      .select({
        id: ponPorts.id,
        oltId: ponPorts.oltId,
        name: ponPorts.name,
        portNumber: ponPorts.portNumber,
        maxOnu: ponPorts.maxOnu,
        description: ponPorts.description,
        createdAt: ponPorts.createdAt,
        updatedAt: ponPorts.updatedAt,
        activeOnus: sql<number>`cast(count(${onus.id}) as integer)`,
      })
      .from(ponPorts)
      .leftJoin(onus, and(eq(onus.oltId, ponPorts.oltId), eq(onus.ponPort, ponPorts.name)))
      .where(eq(ponPorts.id, id))
      .groupBy(ponPorts.id)
      .execute();

    if (result.length === 0) return undefined;

    const port = result[0];
    return {
      ...port,
      availableSlots: Math.max(0, port.maxOnu - port.activeOnus),
    };
  }

  async update(id: string, portData: UpdatePonPortInput) {
    await db
      .update(ponPorts)
      .set({ ...portData, updatedAt: new Date() })
      .where(eq(ponPorts.id, id))
      .execute();
    return this.findById(id);
  }

  async listByOlt(
    oltId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<PaginatedResult<any>> {
    const limit = params?.limit ?? 10;
    const offset = params?.offset ?? 0;

    const data = await db
      .select({
        id: ponPorts.id,
        oltId: ponPorts.oltId,
        name: ponPorts.name,
        portNumber: ponPorts.portNumber,
        maxOnu: ponPorts.maxOnu,
        description: ponPorts.description,
        createdAt: ponPorts.createdAt,
        updatedAt: ponPorts.updatedAt,
        activeOnus: sql<number>`cast(count(${onus.id}) as integer)`,
      })
      .from(ponPorts)
      .leftJoin(onus, and(eq(onus.oltId, ponPorts.oltId), eq(onus.ponPort, ponPorts.name)))
      .where(eq(ponPorts.oltId, oltId))
      .groupBy(ponPorts.id)
      .limit(limit)
      .offset(offset)
      .execute();

    const formattedData = data.map((port) => ({
      ...port,
      availableSlots: Math.max(0, port.maxOnu - port.activeOnus),
    }));

    const totalResult = await db
      .select({ count: count(ponPorts.id) })
      .from(ponPorts)
      .where(eq(ponPorts.oltId, oltId))
      .execute();

    return {
      data: formattedData,
      total: totalResult[0]?.count ?? 0,
      limit,
      offset,
    };
  }
}
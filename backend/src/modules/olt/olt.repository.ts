import { db } from '../../db';
import { olts } from '../../db/schema';
import { eq, count } from 'drizzle-orm';
import { NewOlt, UpdateOlt } from './olt.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class OltRepository {
  async findById(id: string) {
    return db.query.olts.findFirst({
      where: eq(olts.id, id),
      with: {
        pop: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByName(name: string) {
    return db.query.olts.findFirst({
      where: eq(olts.name, name),
      with: {
        pop: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(oltData: NewOlt & { passwordHash: string }) {
    const [newOlt] = await db.insert(olts).values(oltData).returning();
    return this.findById(newOlt.id);
  }

  async update(id: string, oltData: UpdateOlt & { passwordHash?: string }) {
    const [updatedOlt] = await db
      .update(olts)
      .set({ ...oltData, updatedAt: new Date() })
      .where(eq(olts.id, id))
      .returning();
    return updatedOlt ? this.findById(updatedOlt.id) : undefined;
  }

  async delete(id: string) {
    const [deletedOlt] = await db.delete(olts).where(eq(olts.id, id)).returning();
    return deletedOlt ? this.findById(deletedOlt.id) : undefined;
  }

  async list(params?: { limit?: number; offset?: number }): Promise<PaginatedResult<typeof olts.$inferSelect>> {
    const limit = params?.limit ?? 10;
    const offset = params?.offset ?? 0;

    const data = await db.query.olts.findMany({
      limit,
      offset,
      with: {
        pop: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    const total = await db.select({ count: count(olts.id) }).from(olts).execute();

    return {
      data,
      total: total[0]?.count ?? 0,
      limit,
      offset,
    };
  }
}
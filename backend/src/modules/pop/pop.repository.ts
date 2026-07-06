import { db } from '../../db';
import { pops } from '../../db/schema/pop';
import { eq, sql } from 'drizzle-orm';
import { CreatePopInput, UpdatePopInput } from './schemas';

export class PopRepository {
  async findById(id: string) {
    return db.query.pops.findFirst({
      where: eq(pops.id, id),
      with: {
        region: true,
      },
    });
  }

  async findByName(name: string) {
    return db.query.pops.findFirst({
      where: eq(pops.name, name),
      with: {
        region: true,
      },
    });
  }

  async list(limit = 50, offset = 0) {
    const data = await db.query.pops.findMany({
      limit,
      offset,
      with: {
        region: true,
      },
    });
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(pops);
    return { data, total: Number(count), limit, offset };
  }

  async create(data: CreatePopInput) {
    const [newPop] = await db.insert(pops).values(data).returning();
    return this.findById(newPop.id);
  }

  async update(id: string, data: UpdatePopInput) {
    const [updated] = await db
      .update(pops)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pops.id, id))
      .returning();
    return updated ? this.findById(updated.id) : undefined;
  }

  async delete(id: string) {
    const [deleted] = await db.delete(pops).where(eq(pops.id, id)).returning();
    return deleted ? this.findById(deleted.id) : undefined;
  }
}
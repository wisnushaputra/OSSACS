import { db } from '../../db';
import { regions } from '../../db/schema/region';
import { eq, sql } from 'drizzle-orm';
import { CreateRegionInput, UpdateRegionInput } from './schemas';

export class RegionRepository {
  async findById(id: string) {
    return db.query.regions.findFirst({
      where: eq(regions.id, id),
    });
  }

  async findByName(name: string) {
    return db.query.regions.findFirst({
      where: eq(regions.name, name),
    });
  }

  async list(limit = 50, offset = 0) {
    const data = await db.query.regions.findMany({ limit, offset });
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(regions);
    return { data, total: Number(count), limit, offset };
  }

  async create(data: CreateRegionInput) {
    const [newRegion] = await db.insert(regions).values(data).returning();
    return newRegion;
  }

  async update(id: string, data: UpdateRegionInput) {
    const [updated] = await db
      .update(regions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(regions.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    const [deleted] = await db.delete(regions).where(eq(regions.id, id)).returning();
    return deleted;
  }
}
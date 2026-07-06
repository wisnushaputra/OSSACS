import { db } from '../../db';
import { regions } from '../../db/schema/region';
import { eq, sql } from 'drizzle-orm';
export class RegionRepository {
    async findById(id) {
        return db.query.regions.findFirst({
            where: eq(regions.id, id),
        });
    }
    async findByName(name) {
        return db.query.regions.findFirst({
            where: eq(regions.name, name),
        });
    }
    async list(limit = 50, offset = 0) {
        const data = await db.query.regions.findMany({ limit, offset });
        const [{ count }] = await db.select({ count: sql `count(*)` }).from(regions);
        return { data, total: Number(count), limit, offset };
    }
    async create(data) {
        const [newRegion] = await db.insert(regions).values(data).returning();
        return newRegion;
    }
    async update(id, data) {
        const [updated] = await db
            .update(regions)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(regions.id, id))
            .returning();
        return updated;
    }
    async delete(id) {
        const [deleted] = await db.delete(regions).where(eq(regions.id, id)).returning();
        return deleted;
    }
}

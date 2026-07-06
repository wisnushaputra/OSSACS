import { db } from '../../db';
import { profiles } from '../../db/schema/profile';
import { eq, sql } from 'drizzle-orm';
export class ProfileRepository {
    async findById(id) {
        return db.query.profiles.findFirst({
            where: eq(profiles.id, id),
        });
    }
    async list(limit = 50, offset = 0) {
        const data = await db.query.profiles.findMany({ limit, offset });
        const [{ count }] = await db.select({ count: sql `count(*)` }).from(profiles);
        return { data, total: Number(count), limit, offset };
    }
    async create(data) {
        const [newProfile] = await db.insert(profiles).values(data).returning();
        return newProfile;
    }
    async update(id, data) {
        const [updated] = await db
            .update(profiles)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(profiles.id, id))
            .returning();
        return updated;
    }
    async delete(id) {
        const [deleted] = await db.delete(profiles).where(eq(profiles.id, id)).returning();
        return deleted;
    }
}

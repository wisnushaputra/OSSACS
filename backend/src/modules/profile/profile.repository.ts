import { db } from '../../db';
import { profiles } from '../../db/schema/profile';
import { eq, sql } from 'drizzle-orm';
import { CreateProfileInput, UpdateProfileInput } from './schemas';

export class ProfileRepository {
  async findById(id: string) {
    return db.query.profiles.findFirst({
      where: eq(profiles.id, id),
    });
  }

  async list(limit = 50, offset = 0) {
    const data = await db.query.profiles.findMany({ limit, offset });
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(profiles);
    return { data, total: Number(count), limit, offset };
  }

  async create(data: CreateProfileInput) {
    const [newProfile] = await db.insert(profiles).values(data).returning();
    return newProfile;
  }

  async update(id: string, data: UpdateProfileInput) {
    const [updated] = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    const [deleted] = await db.delete(profiles).where(eq(profiles.id, id)).returning();
    return deleted;
  }
}
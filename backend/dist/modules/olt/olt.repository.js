import { db } from '../../db';
import { olts } from '../../db/schema';
import { eq, count } from 'drizzle-orm';
export class OltRepository {
    async findById(id) {
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
    async findByName(name) {
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
    async create(oltData) {
        const [newOlt] = await db.insert(olts).values(oltData).returning();
        return this.findById(newOlt.id);
    }
    async update(id, oltData) {
        const [updatedOlt] = await db
            .update(olts)
            .set({ ...oltData, updatedAt: new Date() })
            .where(eq(olts.id, id))
            .returning();
        return updatedOlt ? this.findById(updatedOlt.id) : undefined;
    }
    async delete(id) {
        const [deletedOlt] = await db.delete(olts).where(eq(olts.id, id)).returning();
        return deletedOlt ? this.findById(deletedOlt.id) : undefined;
    }
    async list(params) {
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

import { db } from '../../db';
import { vendors } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';
export class VendorRepository {
    async findById(id) {
        return db.query.vendors.findFirst({
            where: eq(vendors.id, id),
        });
    }
    async findByName(name) {
        return db.query.vendors.findFirst({
            where: eq(vendors.name, name),
        });
    }
    async list(limit = 50, offset = 0) {
        const data = await db.query.vendors.findMany({ limit, offset });
        const [{ count }] = await db.select({ count: sql `count(*)` }).from(vendors);
        return { data, total: Number(count), limit, offset };
    }
    async create(data) {
        const [newVendor] = await db.insert(vendors).values(data).returning();
        return newVendor;
    }
    async update(id, data) {
        const [updatedVendor] = await db
            .update(vendors)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(vendors.id, id))
            .returning();
        return updatedVendor;
    }
    async delete(id) {
        const [deletedVendor] = await db.delete(vendors).where(eq(vendors.id, id)).returning();
        return deletedVendor;
    }
}

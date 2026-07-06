import { db } from '../../db';
import { onus, customers, olts } from '../../db/schema';
import { and, eq, ilike, or, count, getTableColumns } from 'drizzle-orm';
export class OnuRepository {
    async findById(id) {
        return db.query.onus.findFirst({
            where: eq(onus.id, id),
            with: {
                customer: true,
                olt: true,
            },
        });
    }
    async findBySerialNumber(serialNumber) {
        return db.query.onus.findFirst({
            where: eq(onus.serialNumber, serialNumber),
        });
    }
    async findByGenieDeviceId(genieDeviceId) {
        return db.query.onus.findFirst({
            where: eq(onus.genieDeviceId, genieDeviceId),
        });
    }
    async create(onuData) {
        const [newOnu] = await db.insert(onus).values(onuData).returning();
        return this.findById(newOnu.id);
    }
    async update(id, onuData) {
        const [updatedOnu] = await db
            .update(onus)
            .set({ ...onuData, updatedAt: new Date() })
            .where(eq(onus.id, id))
            .returning();
        return updatedOnu ? this.findById(updatedOnu.id) : undefined;
    }
    async delete(id) {
        const [deletedOnu] = await db.delete(onus).where(eq(onus.id, id)).returning();
        return deletedOnu ? this.findById(deletedOnu.id) : undefined;
    }
    async list(params) {
        const limit = params?.limit ?? 10;
        const offset = params?.offset ?? 0;
        const data = await db.query.onus.findMany({
            limit,
            offset,
            with: {
                customer: true,
                olt: true,
            },
        });
        const total = await db.select({ count: count(onus.id) }).from(onus).execute();
        return {
            data,
            total: total[0]?.count ?? 0,
            limit,
            offset,
        };
    }
    async search(params) {
        const q = params.query?.trim();
        const limit = params.limit ?? 10;
        const offset = params.offset ?? 0;
        const whereConditions = [];
        if (q) {
            whereConditions.push(or(ilike(onus.serialNumber, `%${q}%`), ilike(customers.fullName, `%${q}%`), // Needs join with customers
            ilike(olts.vendor, `%${q}%`), // Needs join with olts
            ilike(olts.name, `%${q}%`)));
        }
        if (params.customerId) {
            whereConditions.push(eq(onus.customerId, params.customerId));
        }
        if (params.oltId) {
            whereConditions.push(eq(onus.oltId, params.oltId));
        }
        if (params.vendor) {
            whereConditions.push(ilike(olts.vendor, `%${params.vendor}%`));
        }
        // Assuming status can be searched directly if it's a column in onus schema
        if (params.status) {
            // whereConditions.push(eq(onus.status, params.status)); // Add if 'status' column exists in onus
        }
        const query = db
            .select(getTableColumns(onus)) // Select all fields from onus table
            .from(onus)
            .leftJoin(customers, eq(onus.customerId, customers.id))
            .leftJoin(olts, eq(onus.oltId, olts.id));
        if (whereConditions.length > 0) {
            query.where(and(...whereConditions));
        }
        const data = await query.limit(limit).offset(offset).execute();
        const totalResult = await db
            .select({ count: count(onus.id) })
            .from(onus)
            .leftJoin(customers, eq(onus.customerId, customers.id))
            .leftJoin(olts, eq(onus.oltId, olts.id))
            .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
            .execute();
        const total = totalResult[0]?.count ?? 0;
        return {
            data,
            total,
            limit,
            offset,
        };
    }
}

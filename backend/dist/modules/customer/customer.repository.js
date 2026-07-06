import { db } from '../../db';
import { customers, onus } from '../../db/schema';
import { and, eq, ilike, or, count, countDistinct } from 'drizzle-orm';
export class CustomerRepository {
    async findById(id) {
        return db.query.customers.findFirst({
            where: eq(customers.id, id),
        });
    }
    async findByCustomerCode(customerCode) {
        return db.query.customers.findFirst({
            where: eq(customers.customerCode, customerCode),
        });
    }
    async search(params) {
        const q = params.query?.trim();
        const limit = params.limit ?? 10;
        const offset = params.offset ?? 0;
        const whereConditions = [];
        if (q) {
            whereConditions.push(or(ilike(customers.customerCode, `%${q}%`), ilike(customers.fullName, `%${q}%`), ilike(customers.phone, `%${q}%`)));
        }
        const query = db
            .selectDistinct({
            id: customers.id,
            customerCode: customers.customerCode,
            fullName: customers.fullName,
            phone: customers.phone,
            address: customers.address,
            email: customers.email,
            status: customers.status,
            createdAt: customers.createdAt,
            updatedAt: customers.updatedAt,
            deletedAt: customers.deletedAt,
        })
            .from(customers)
            .leftJoin(onus, eq(onus.customerId, customers.id));
        if (q && q.length > 0) { // Add ONU serial search only if query exists
            const onuSearchCondition = ilike(onus.serialNumber, `%${q}%`);
            query.where(whereConditions.length > 0
                ? or(and(...whereConditions), onuSearchCondition)
                : onuSearchCondition);
        }
        const data = await query.limit(limit).offset(offset).execute();
        const totalResult = await db
            .select({
            count: countDistinct(customers.id),
        })
            .from(customers)
            .leftJoin(onus, eq(onus.customerId, customers.id))
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
    async list(params) {
        const limit = params?.limit ?? 10;
        const offset = params?.offset ?? 0;
        const data = await db.query.customers.findMany({
            limit,
            offset,
        });
        const total = await db.select({ count: count(customers.id) }).from(customers).execute();
        return {
            data,
            total: total[0]?.count ?? 0,
            limit,
            offset,
        };
    }
    async create(customerData) {
        const [newCustomer] = await db.insert(customers).values(customerData).returning();
        return this.findById(newCustomer.id);
    }
    async update(id, customerData) {
        const [updatedCustomer] = await db
            .update(customers)
            .set({ ...customerData, updatedAt: new Date() })
            .where(eq(customers.id, id))
            .returning();
        return updatedCustomer ? this.findById(updatedCustomer.id) : undefined;
    }
    async delete(id) {
        const [deletedCustomer] = await db.delete(customers).where(eq(customers.id, id)).returning();
        return deletedCustomer ? this.findById(deletedCustomer.id) : undefined;
    }
}

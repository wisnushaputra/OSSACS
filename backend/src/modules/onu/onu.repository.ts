import { db } from '../../db';
import { onus, customers, olts } from '../../db/schema';
import { and, eq, ilike, or, count, getTableColumns } from 'drizzle-orm';
import { NewOnu, UpdateOnuInput } from './onu.schema';

export interface OnuSearchParams {
  query?: string;
  customerId?: string;
  oltId?: string;
  vendor?: string;
  status?: string; // Assuming status can be derived or is part of the ONU entity
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export class OnuRepository {
  async findById(id: string) {
    return db.query.onus.findFirst({
      where: eq(onus.id, id),
      with: {
        customer: true,
        olt: true,
      },
    });
  }

  async findBySerialNumber(serialNumber: string) {
    return db.query.onus.findFirst({
      where: eq(onus.serialNumber, serialNumber),
    });
  }

  async findByGenieDeviceId(genieDeviceId: string) {
    return db.query.onus.findFirst({
      where: eq(onus.genieDeviceId, genieDeviceId),
    });
  }

  async create(onuData: NewOnu) {
    const [newOnu] = await db.insert(onus).values(onuData).returning();
    return this.findById(newOnu.id);
  }

  async update(id: string, onuData: UpdateOnuInput) {
    const [updatedOnu] = await db
      .update(onus)
      .set({ ...onuData, updatedAt: new Date() } as any)
      .where(eq(onus.id, id))
      .returning();
    return updatedOnu ? this.findById(updatedOnu.id) : undefined;
  }

  async delete(id: string) {
    const [deletedOnu] = await db.delete(onus).where(eq(onus.id, id)).returning();
    return deletedOnu ? this.findById(deletedOnu.id) : undefined;
  }

  async list(params?: { limit?: number; offset?: number }): Promise<PaginatedResult<typeof onus.$inferSelect>> {
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

  async search(params: OnuSearchParams): Promise<PaginatedResult<typeof onus.$inferSelect>> {
    const q = params.query?.trim();
    const limit = params.limit ?? 10;
    const offset = params.offset ?? 0;

    const whereConditions = [];

    if (q) {
      whereConditions.push(
        or(
          ilike(onus.serialNumber, `%${q}%`),
          ilike(customers.fullName, `%${q}%`), // Needs join with customers
          ilike(olts.vendor, `%${q}%`),       // Needs join with olts
          ilike(olts.name, `%${q}%`),         // Needs join with olts
        ),
      );
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
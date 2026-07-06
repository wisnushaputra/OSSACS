import { db } from '../../db';
import { jobs } from '../../db/schema';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
export class JobRepository {
    async findById(id) {
        return db.query.jobs.findFirst({
            where: eq(jobs.id, id),
        });
    }
    async search(params) {
        const limit = params.limit ?? 10;
        const offset = params.offset ?? 0;
        const whereConditions = [];
        if (params.jobName) {
            whereConditions.push(eq(jobs.jobName, params.jobName));
        }
        if (params.status) {
            whereConditions.push(eq(jobs.status, params.status));
        }
        if (params.startDate) {
            whereConditions.push(gte(jobs.createdAt, new Date(params.startDate)));
        }
        if (params.endDate) {
            whereConditions.push(lte(jobs.createdAt, new Date(params.endDate)));
        }
        const data = await db.query.jobs.findMany({
            where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
            orderBy: [desc(jobs.createdAt)],
            limit,
            offset,
        });
        const totalResult = await db
            .select({ count: count(jobs.id) })
            .from(jobs)
            .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
            .execute();
        const total = Number(totalResult[0]?.count ?? 0);
        return {
            data: data,
            total,
            limit,
            offset,
        };
    }
    async update(id, data) {
        const [updatedJob] = await db
            .update(jobs)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(jobs.id, id))
            .returning();
        return updatedJob;
    }
}

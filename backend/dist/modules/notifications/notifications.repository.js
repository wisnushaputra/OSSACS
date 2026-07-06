import { db } from '../../db';
import { notifications } from '../../db/schema';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
export class NotificationRepository {
    async findById(id) {
        return db.query.notifications.findFirst({
            where: eq(notifications.id, id),
        });
    }
    async search(params) {
        const limit = params.limit ?? 10;
        const offset = params.offset ?? 0;
        const whereConditions = [];
        if (params.userId) {
            whereConditions.push(eq(notifications.userId, params.userId));
        }
        if (params.level) {
            whereConditions.push(eq(notifications.level, params.level));
        }
        if (params.isRead !== undefined) {
            whereConditions.push(eq(notifications.isRead, params.isRead));
        }
        if (params.startDate) {
            whereConditions.push(gte(notifications.createdAt, new Date(params.startDate)));
        }
        if (params.endDate) {
            whereConditions.push(lte(notifications.createdAt, new Date(params.endDate)));
        }
        const data = await db.query.notifications.findMany({
            where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
            orderBy: [desc(notifications.createdAt)],
            limit,
            offset,
        });
        const totalResult = await db
            .select({ count: count(notifications.id) })
            .from(notifications)
            .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
            .execute();
        const total = Number(totalResult[0]?.count ?? 0);
        return {
            data,
            total,
            limit,
            offset,
        };
    }
    async update(id, data) {
        const [updatedNotification] = await db
            .update(notifications)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(notifications.id, id))
            .returning();
        return updatedNotification;
    }
}

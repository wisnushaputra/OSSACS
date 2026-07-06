import { db } from '../../db';
import { deviceStatus } from '../../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
export class DeviceStatusRepository {
    async findByOnuId(onuId) {
        return db.query.deviceStatus.findFirst({
            where: eq(deviceStatus.onuId, onuId),
            orderBy: [desc(deviceStatus.updatedAt)],
        });
    }
    async list(params) {
        const limit = params?.limit ?? 10;
        const offset = params?.offset ?? 0;
        // Use a CTE or subquery to select only the latest status row for each onuId
        const sq = db
            .select({
            id: deviceStatus.id,
            onuId: deviceStatus.onuId,
            status: deviceStatus.status,
            rxPower: deviceStatus.rxPower,
            txPower: deviceStatus.txPower,
            uptime: deviceStatus.uptime,
            ipAddress: deviceStatus.ipAddress,
            lastInform: deviceStatus.lastInform,
            lastContact: deviceStatus.lastContact,
            updatedAt: deviceStatus.updatedAt,
            rowNumber: sql `row_number() over (partition by ${deviceStatus.onuId} order by ${deviceStatus.updatedAt} desc)`.as('rn'),
        })
            .from(deviceStatus)
            .as('sq');
        const data = await db
            .select({
            id: sq.id,
            onuId: sq.onuId,
            status: sq.status,
            rxPower: sq.rxPower,
            txPower: sq.txPower,
            uptime: sq.uptime,
            ipAddress: sq.ipAddress,
            lastInform: sq.lastInform,
            lastContact: sq.lastContact,
            updatedAt: sq.updatedAt,
        })
            .from(sq)
            .where(eq(sq.rowNumber, 1))
            .limit(limit)
            .offset(offset)
            .execute();
        const totalResult = await db
            .select({ count: sql `count(distinct ${deviceStatus.onuId})` })
            .from(deviceStatus)
            .execute();
        const total = Number(totalResult[0]?.count ?? 0);
        return {
            data: data,
            total,
            limit,
            offset,
        };
    }
    async create(data) {
        const [newStatus] = await db
            .insert(deviceStatus)
            .values(data)
            .returning();
        return newStatus;
    }
}

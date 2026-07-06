import { db } from '../../db';
import { customers, olts, onus, deviceStatus, alarms, workflows, pops } from '../../db/schema';
import { eq, isNull, sql, and, gte, lte } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
// CTE for the latest status per ONU - defined once
const latestDeviceStatus = db
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
    .as('latest_device_status');
export class DashboardRepository {
    async getTotalCustomers() {
        const result = await db
            .select({ count: sql `count(*)` })
            .from(customers)
            .where(isNull(customers.deletedAt))
            .execute();
        return Number(result[0]?.count ?? 0);
    }
    async getTotalOlts() {
        const result = await db
            .select({ count: sql `count(*)` })
            .from(olts)
            .where(isNull(olts.deletedAt))
            .execute();
        return Number(result[0]?.count ?? 0);
    }
    async getTotalOnus() {
        const result = await db
            .select({ count: sql `count(*)` })
            .from(onus)
            .where(isNull(onus.deletedAt))
            .execute();
        return Number(result[0]?.count ?? 0);
    }
    async getLatestOnuStatusCounts(filters) {
        const { regionId, popId, vendorId, oltId } = filters;
        const conditions = [isNull(onus.deletedAt)];
        const oltAlias = alias(olts, 'olt_alias');
        const popAlias = alias(pops, 'pop_alias');
        let query = db
            .select({
            status: latestDeviceStatus.status,
            count: sql `count(*)`,
        })
            .from(onus)
            .leftJoin(latestDeviceStatus, eq(onus.id, latestDeviceStatus.onuId));
        if (regionId || popId || vendorId || oltId) {
            query = query.leftJoin(oltAlias, eq(onus.oltId, oltAlias.id));
            if (popId || regionId) {
                query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
            }
        }
        if (regionId)
            conditions.push(eq(popAlias.regionId, regionId));
        if (popId)
            conditions.push(eq(oltAlias.popId, popId));
        if (vendorId)
            conditions.push(eq(oltAlias.vendor, vendorId));
        if (oltId)
            conditions.push(eq(onus.oltId, oltId));
        const result = await query
            .where(and(eq(latestDeviceStatus.rowNumber, 1), ...conditions))
            .groupBy(latestDeviceStatus.status)
            .execute();
        const counts = { ONLINE: 0, OFFLINE: 0, LOS: 0, DYING_GASP: 0, UNKNOWN: 0 };
        result.forEach((r) => {
            if (r.status && r.status in counts) {
                counts[r.status] = Number(r.count);
            }
        });
        return counts;
    }
    async getActiveAlarmCount(filters) {
        const { regionId, popId, vendorId, oltId, startDate, endDate } = filters;
        const conditions = [isNull(alarms.resolvedAt)];
        const onuAlias = alias(onus, 'onu_alarm_alias');
        const oltAlias = alias(olts, 'olt_alarm_alias');
        const popAlias = alias(pops, 'pop_alarm_alias');
        let query = db
            .select({ count: sql `count(*)` })
            .from(alarms)
            .leftJoin(onuAlias, eq(alarms.onuId, onuAlias.id));
        if (regionId || popId || vendorId || oltId) {
            query = query.leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));
            if (popId || regionId) {
                query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
            }
        }
        if (regionId)
            conditions.push(eq(popAlias.regionId, regionId));
        if (popId)
            conditions.push(eq(oltAlias.popId, popId));
        if (vendorId)
            conditions.push(eq(oltAlias.vendor, vendorId));
        if (oltId)
            conditions.push(eq(onuAlias.oltId, oltId));
        if (startDate)
            conditions.push(gte(alarms.createdAt, new Date(startDate)));
        if (endDate)
            conditions.push(lte(alarms.createdAt, new Date(endDate)));
        const result = await query
            .where(and(...conditions))
            .execute();
        return Number(result[0]?.count ?? 0);
    }
    async getRunningWorkflowCount(filters) {
        const { regionId, popId, vendorId, oltId, startDate, endDate } = filters;
        const conditions = [eq(workflows.status, 'IN_PROGRESS')];
        const onuAlias = alias(onus, 'onu_workflow_alias');
        const oltAlias = alias(olts, 'olt_workflow_alias');
        const popAlias = alias(pops, 'pop_workflow_alias');
        let query = db
            .select({ count: sql `count(*)` })
            .from(workflows)
            .leftJoin(onuAlias, eq(workflows.onuId, onus.id));
        if (regionId || popId || vendorId || oltId) {
            query = query.leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));
            if (popId || regionId) {
                query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
            }
        }
        if (regionId)
            conditions.push(eq(popAlias.regionId, regionId));
        if (popId)
            conditions.push(eq(oltAlias.popId, popId));
        if (vendorId)
            conditions.push(eq(oltAlias.vendor, vendorId));
        if (oltId)
            conditions.push(eq(onuAlias.oltId, oltId));
        if (startDate)
            conditions.push(gte(workflows.startedAt, new Date(startDate)));
        if (endDate)
            conditions.push(lte(workflows.startedAt, new Date(endDate)));
        const result = await query
            .where(and(...conditions))
            .execute();
        return Number(result[0]?.count ?? 0);
    }
    async getOltHealthSummary() {
        const result = await db
            .select({
            status: olts.status,
            count: sql `count(*)`,
        })
            .from(olts)
            .where(isNull(olts.deletedAt))
            .groupBy(olts.status)
            .execute();
        return result;
    }
    async getOltByVendor() {
        const result = await db
            .select({
            vendor: olts.vendor,
            count: sql `count(*)`,
        })
            .from(olts)
            .where(isNull(olts.deletedAt))
            .groupBy(olts.vendor)
            .execute();
        return result;
    }
    async getPonPortUtilization() {
        return { totalPorts: 0, usedPorts: 0 };
    }
    async getOnuCapacityUsage() {
        const result = await db
            .select({
            oltName: olts.name,
            onuCount: sql `count(${onus.id})`,
        })
            .from(olts)
            .leftJoin(onus, eq(olts.id, onus.oltId))
            .where(isNull(olts.deletedAt))
            .groupBy(olts.name)
            .execute();
        return result;
    }
}

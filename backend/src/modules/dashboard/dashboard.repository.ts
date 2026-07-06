import { db } from '../../db';
import { customers, olts, onus, deviceStatus, alarms, workflows, pops, regions, vendors } from '../../db/schema';
import { eq, isNull, sql, and, gte, lte } from 'drizzle-orm';
import { DashboardFilterParams } from './dashboard.schema';
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
    rowNumber: sql`row_number() over (partition by ${deviceStatus.onuId} order by ${deviceStatus.updatedAt} desc)`.as('rn'),
  })
  .from(deviceStatus)
  .as('latest_device_status');

export class DashboardRepository {
  async getTotalCustomers(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(isNull(customers.deletedAt))
      .execute();
    return Number(result[0]?.count ?? 0);
  }

  async getTotalOlts(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(olts)
      .where(isNull(olts.deletedAt))
      .execute();
    return Number(result[0]?.count ?? 0);
  }

  async getTotalOnus(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(onus)
      .where(isNull(onus.deletedAt))
      .execute();
    return Number(result[0]?.count ?? 0);
  }

  async getLatestOnuStatusCounts(filters: DashboardFilterParams) {
    const { regionId, popId, vendorId, oltId } = filters;

    const conditions = [isNull(onus.deletedAt)];

    const oltAlias = alias(olts, 'olt_alias');
    const popAlias = alias(pops, 'pop_alias');

    let query: any = db
      .select({
        status: latestDeviceStatus.status,
        count: sql<number>`count(*)`,
      })
      .from(onus)
      .leftJoin(latestDeviceStatus, eq(onus.id, latestDeviceStatus.onuId));

    if (regionId || popId || vendorId || oltId) {
      query = query.leftJoin(oltAlias, eq(onus.oltId, oltAlias.id));
      if (popId || regionId) {
        query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
      }
    }
    
    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(oltAlias.popId, popId));
    if (vendorId) conditions.push(eq(oltAlias.vendor, vendorId));
    if (oltId) conditions.push(eq(onus.oltId, oltId));

    const result = await query
      .where(and(eq(latestDeviceStatus.rowNumber, 1), ...conditions))
      .groupBy(latestDeviceStatus.status)
      .execute();

    const counts = { ONLINE: 0, OFFLINE: 0, LOS: 0, DYING_GASP: 0, UNKNOWN: 0 };
    result.forEach((r: any) => {
      if (r.status && r.status in counts) {
        counts[r.status as keyof typeof counts] = Number(r.count);
      }
    });
    return counts;
  }

  async getActiveAlarmCount(filters: DashboardFilterParams): Promise<number> {
    const { regionId, popId, vendorId, oltId, startDate, endDate } = filters;
    const conditions = [isNull(alarms.resolvedAt)];

    const onuAlias = alias(onus, 'onu_alarm_alias');
    const oltAlias = alias(olts, 'olt_alarm_alias');
    const popAlias = alias(pops, 'pop_alarm_alias');

    let query: any = db
      .select({ count: sql<number>`count(*)` })
      .from(alarms)
      .leftJoin(onuAlias, eq(alarms.onuId, onuAlias.id));

    if (regionId || popId || vendorId || oltId) {
      query = query.leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));
      if (popId || regionId) {
        query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
      }
    }

    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(oltAlias.popId, popId));
    if (vendorId) conditions.push(eq(oltAlias.vendor, vendorId));
    if (oltId) conditions.push(eq(onuAlias.oltId, oltId));

    if (startDate) conditions.push(gte(alarms.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(alarms.createdAt, new Date(endDate)));

    const result = await query
      .where(and(...conditions))
      .execute();

    return Number(result[0]?.count ?? 0);
  }

  async getRunningWorkflowCount(filters: DashboardFilterParams): Promise<number> {
    const { regionId, popId, vendorId, oltId, startDate, endDate } = filters;
    const conditions = [eq(workflows.status, 'IN_PROGRESS')];

    const onuAlias = alias(onus, 'onu_workflow_alias');
    const oltAlias = alias(olts, 'olt_workflow_alias');
    const popAlias = alias(pops, 'pop_workflow_alias');

    let query: any = db
      .select({ count: sql<number>`count(*)` })
      .from(workflows)
      .leftJoin(onuAlias, eq(workflows.onuId, onus.id));

    if (regionId || popId || vendorId || oltId) {
      query = query.leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));
      if (popId || regionId) {
        query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
      }
    }

    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(oltAlias.popId, popId));
    if (vendorId) conditions.push(eq(oltAlias.vendor, vendorId));
    if (oltId) conditions.push(eq(onuAlias.oltId, oltId));

    if (startDate) conditions.push(gte(workflows.startedAt, new Date(startDate)));
    if (endDate) conditions.push(lte(workflows.startedAt, new Date(endDate)));

    const result = await query
      .where(and(...conditions))
      .execute();

    return Number(result[0]?.count ?? 0);
  }

  async getOltHealthSummary(): Promise<any[]> {
    const result = await db
      .select({
        status: olts.status,
        count: sql<number>`count(*)`,
      })
      .from(olts)
      .where(isNull(olts.deletedAt))
      .groupBy(olts.status)
      .execute();
    return result;
  }

  async getOltByVendor(): Promise<any[]> {
    const result = await db
      .select({
        vendor: olts.vendor,
        count: sql<number>`count(*)`,
      })
      .from(olts)
      .where(isNull(olts.deletedAt))
      .groupBy(olts.vendor)
      .execute();
    return result;
  }

  async getPonPortUtilization(): Promise<any> {
    return { totalPorts: 0, usedPorts: 0 };
  }

  async getOnuCapacityUsage(): Promise<any[]> {
    const result = await db
      .select({
        oltName: olts.name,
        onuCount: sql<number>`count(${onus.id})`,
      })
      .from(olts)
      .leftJoin(onus, eq(olts.id, onus.oltId))
      .where(isNull(olts.deletedAt))
      .groupBy(olts.name)
      .execute();
    
    return result;
  }
}


import { db } from '../../db';
import { alarms, onus, olts, pops, regions, customers } from '../../db/schema';
import { sql, count, eq, isNull, and, gte, lte, desc } from 'drizzle-orm';
import { DashboardFilterParams } from './dashboard.schema';
import { alias } from 'drizzle-orm/pg-core';

export class AlarmStatsRepository {
  private buildAlarmQuery(filters: DashboardFilterParams, selectFields: any): any {
    const { regionId, popId, vendorId, oltId, startDate, endDate } = filters;
    const conditions = [isNull(alarms.resolvedAt)];

    const onuAlias = alias(onus, 'onu_alarm_alias');
    const oltAlias = alias(olts, 'olt_alarm_alias');
    const popAlias = alias(pops, 'pop_alarm_alias');
    
    let query = db
      .select(selectFields)
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

    return query.where(and(...conditions));
  }

  async getActiveAlarmCounter(filters: DashboardFilterParams): Promise<number> {
    const query = this.buildAlarmQuery(filters, { count: count(alarms.id) });
    const result = await query.execute();
    return Number(result[0]?.count ?? 0);
  }

  async getAlarmBySeverity(filters: DashboardFilterParams) {
    const query = this.buildAlarmQuery(filters, {
      severity: alarms.severity,
      count: count(alarms.id),
    });
    return await query.groupBy(alarms.severity).execute();
  }

  async getAlarmTrend(interval: '24h' | '7d' | '30d' | 'all', filters: DashboardFilterParams) {
    const format = interval === '24h' ? 'hour' : (interval === '7d' ? 'day' : 'month');
    const timeTrunc = sql`date_trunc(${format}, ${alarms.createdAt})`;
    const query = this.buildAlarmQuery(filters, {
      time: timeTrunc.as('time'),
      count: count(alarms.id),
    });
    return await query
      .groupBy(timeTrunc)
      .orderBy(timeTrunc)
      .execute();
  }

  async getLatestAlarmsTable(limit: number = 10, filters: DashboardFilterParams) {
    const { regionId, popId, vendorId, oltId, startDate, endDate } = filters;
    const conditions = [isNull(alarms.resolvedAt)];

    const onuAlias = alias(onus, 'onu_latest_alarm_alias');
    const oltAlias = alias(olts, 'olt_latest_alarm_alias');
    const popAlias = alias(pops, 'pop_latest_alarm_alias');
    const customerAlias = alias(customers, 'customer_latest_alarm_alias');

    let query: any = db
      .select({
        id: alarms.id,
        description: alarms.description,
        severity: alarms.severity,
        createdAt: alarms.createdAt,
        onuId: alarms.onuId,
        customer: customerAlias.fullName,
        onuSerialNumber: onuAlias.serialNumber,
        oltName: oltAlias.name,
      })
      .from(alarms)
      .leftJoin(onuAlias, eq(alarms.onuId, onuAlias.id))
      .leftJoin(customerAlias, eq(onuAlias.customerId, customerAlias.id))
      .leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));

    if (regionId || popId) {
      query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
    }

    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(oltAlias.popId, popId));
    if (vendorId) conditions.push(eq(oltAlias.vendor, vendorId));
    if (oltId) conditions.push(eq(onuAlias.oltId, oltId));

    if (startDate) conditions.push(gte(alarms.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(alarms.createdAt, new Date(endDate)));

    return await query
      .where(and(...conditions))
      .orderBy(desc(alarms.createdAt))
      .limit(limit)
      .execute();
  }
}

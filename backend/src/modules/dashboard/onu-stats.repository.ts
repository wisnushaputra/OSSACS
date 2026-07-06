import { db } from '../../db';
import { onus, deviceStatus, opticalHistory, olts, pops, regions, vendors } from '../../db/schema';
import { sql, isNull, eq, count, and, gte, lte, isNotNull } from 'drizzle-orm';
import { DashboardFilterParams } from './dashboard.schema';
import { alias } from 'drizzle-orm/pg-core';

export class OnuStatsRepository {
  private getLatestOnuStatusSubquery(filters?: DashboardFilterParams) {
    const onuAlias = alias(onus, 'onu_latest_status_alias');
    const oltAlias = alias(olts, 'olt_latest_status_alias');
    const popAlias = alias(pops, 'pop_latest_status_alias');
    
    const conditions = [isNull(onuAlias.deletedAt)];

    if (filters?.oltId) conditions.push(eq(onuAlias.oltId, filters.oltId));
    if (filters?.vendorId) conditions.push(eq(onuAlias.manufacturer, filters.vendorId));

    let latestStatusRawQuery = db
      .select({
        onuId: deviceStatus.onuId,
        status: deviceStatus.status,
        rxPower: deviceStatus.rxPower,
        rowNumber: sql`row_number() over (partition by ${deviceStatus.onuId} order by ${deviceStatus.updatedAt} desc)`.as('rn'),
      })
      .from(deviceStatus)
      .as('latest_status_raw');

    let query: any = db
      .select({
        onuId: latestStatusRawQuery.onuId,
        status: latestStatusRawQuery.status,
        rxPower: latestStatusRawQuery.rxPower,
        rn: latestStatusRawQuery.rowNumber,
      })
      .from(onuAlias)
      .leftJoin(latestStatusRawQuery, eq(onuAlias.id, latestStatusRawQuery.onuId));

    if (filters?.regionId || filters?.popId) {
      query = query.leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));
      query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
      if (filters?.regionId) conditions.push(eq(popAlias.regionId, filters.regionId));
      if (filters?.popId) conditions.push(eq(popAlias.id, filters.popId));
    }

    return query.where(and(eq(latestStatusRawQuery.rowNumber, 1), ...conditions)).as('latest_filtered_status');
  }

  async getOnlineOfflineLosDyingGaspCounts(filters: DashboardFilterParams) {
    const latestStatusSubquery = this.getLatestOnuStatusSubquery(filters);

    const result = await db
      .select({
        status: latestStatusSubquery.status,
        count: count(),
      })
      .from(latestStatusSubquery)
      .groupBy(latestStatusSubquery.status)
      .execute();

    const counts = { ONLINE: 0, OFFLINE: 0, LOS: 0, DYING_GASP: 0, UNKNOWN: 0 };
    result.forEach((r) => {
      if (r.status && r.status in counts) {
        counts[r.status as keyof typeof counts] = Number(r.count);
      }
    });
    return counts;
  }

  async getByVendor(filters: DashboardFilterParams) {
    const latestStatusSubquery = this.getLatestOnuStatusSubquery(filters);
    return db
      .select({
        vendor: onus.manufacturer,
        count: count(),
      })
      .from(onus)
      .leftJoin(latestStatusSubquery, eq(onus.id, latestStatusSubquery.onuId))
      .where(isNull(onus.deletedAt))
      .groupBy(onus.manufacturer)
      .execute();
  }

  async getByModel(filters: DashboardFilterParams) {
    const latestStatusSubquery = this.getLatestOnuStatusSubquery(filters);
    return db
      .select({
        model: onus.model,
        count: count(),
      })
      .from(onus)
      .leftJoin(latestStatusSubquery, eq(onus.id, latestStatusSubquery.onuId))
      .where(isNull(onus.deletedAt))
      .groupBy(onus.model)
      .execute();
  }

  async getOpticalPowerDistribution(filters: DashboardFilterParams) {
    const latestStatusSubquery = this.getLatestOnuStatusSubquery(filters);
    const result = await db
      .select({
        rxPower: latestStatusSubquery.rxPower,
      })
      .from(latestStatusSubquery)
      .where(and(isNotNull(latestStatusSubquery.rxPower), eq(latestStatusSubquery.rn, 1)))
      .execute();

    let normal = 0;
    let warning = 0;
    let critical = 0;

    result.forEach((r) => {
      if (r.rxPower) {
        const power = parseFloat(r.rxPower);
        if (power >= -24 && power <= -10) {
          normal++;
        } else if (power < -24 && power >= -28) {
          warning++;
        } else if (power < -28) {
          critical++;
        }
      }
    });

    return { normal, warning, critical };
  }
}

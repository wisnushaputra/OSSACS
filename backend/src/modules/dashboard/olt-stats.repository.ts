import { db } from '../../db';
import { olts, vendors, onus, ponPorts, pops, regions } from '../../db/schema';
import { eq, isNull, count, sql, and } from 'drizzle-orm';
import { DashboardFilterParams } from './dashboard.schema';
import { alias } from 'drizzle-orm/pg-core';

export class OltStatsRepository {
  async getHealthSummary(filters: DashboardFilterParams) {
    const { regionId, popId, vendorId } = filters;
    const conditions = [isNull(olts.deletedAt)];

    const popAlias = alias(pops, 'pop_olt_alias');

    let query: any = db
      .select({
        id: olts.id,
        name: olts.name,
        status: olts.status,
        onuCount: count(onus.id),
        ponPortCount: count(ponPorts.id),
      })
      .from(olts)
      .leftJoin(onus, eq(olts.id, onus.oltId))
      .leftJoin(ponPorts, eq(olts.id, ponPorts.oltId));

    if (regionId || popId) {
      query = query.leftJoin(popAlias, eq(olts.popId, popAlias.id));
    }

    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(olts.popId, popId));
    if (vendorId) conditions.push(eq(olts.vendor, vendorId));

    const oltStatus = await query
      .where(and(...conditions))
      .groupBy(olts.id, olts.name, olts.status)
      .execute();

    const healthSummary = {
      active: 0,
      inactive: 0,
      maintenance: 0,
    };

    oltStatus.forEach((olt: any) => {
      if (olt.status === 'active') {
        healthSummary.active++;
      } else if (olt.status === 'inactive') {
        healthSummary.inactive++;
      } else if (olt.status === 'maintenance') {
        healthSummary.maintenance++;
      }
    });

    return healthSummary;
  }

  async getByVendor(filters: DashboardFilterParams) {
    const { regionId, popId, oltId } = filters;
    const conditions = [isNull(olts.deletedAt)];

    const popAlias = alias(pops, 'pop_olt_alias');

    let query: any = db
      .select({
        vendor: olts.vendor,
        count: count(),
      })
      .from(olts);

    if (regionId || popId) {
      query = query.leftJoin(popAlias, eq(olts.popId, popAlias.id));
    }

    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(olts.popId, popId));
    if (oltId) conditions.push(eq(olts.id, oltId));

    return await query
      .where(and(...conditions))
      .groupBy(olts.vendor)
      .execute();
  }

  async getPonPortUtilization(filters: DashboardFilterParams) {
    const { regionId, popId, oltId } = filters;
    const conditions = [isNull(olts.deletedAt)];

    const popAlias = alias(pops, 'pop_olt_alias');

    let query: any = db
      .select({
        oltId: olts.id,
        ponPortName: ponPorts.name,
        maxOnu: ponPorts.maxOnu,
        onuCount: count(onus.id),
      })
      .from(olts)
      .leftJoin(ponPorts, eq(olts.id, ponPorts.oltId))
      .leftJoin(onus, eq(ponPorts.id, onus.ponPort));

    if (regionId || popId) {
      query = query.leftJoin(popAlias, eq(olts.popId, popAlias.id));
    }

    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(olts.popId, popId));
    if (oltId) conditions.push(eq(olts.id, oltId));

    const result = await query
      .where(and(...conditions))
      .groupBy(olts.id, ponPorts.id)
      .execute();

    const utilization = result.map((row: any) => ({
      oltId: row.oltId,
      ponPortName: row.ponPortName,
      utilization: row.maxOnu && row.maxOnu > 0 ? (Number(row.onuCount) / row.maxOnu) * 100 : 0,
    }));

    return utilization;
  }

  async getOnuCapacityUsage(filters: DashboardFilterParams) {
    const { regionId, popId, oltId } = filters;
    const conditions = [isNull(olts.deletedAt)];

    const popAlias = alias(pops, 'pop_olt_alias');

    let query: any = db
      .select({
        oltId: olts.id,
        onuCount: count(onus.id),
      })
      .from(olts)
      .leftJoin(onus, eq(olts.id, onus.oltId));

    if (regionId || popId) {
      query = query.leftJoin(popAlias, eq(olts.popId, popAlias.id));
    }

    if (regionId) conditions.push(eq(popAlias.regionId, regionId));
    if (popId) conditions.push(eq(olts.popId, popId));
    if (oltId) conditions.push(eq(olts.id, oltId));

    const result = await query
      .where(and(...conditions))
      .groupBy(olts.id)
      .execute();

    return result.map((row: any) => ({
      oltId: row.oltId,
      onuCount: Number(row.onuCount),
    }));
  }
}

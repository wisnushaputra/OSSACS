import { db } from '../../db';
import { customers, regions, pops, olts, onus } from '../../db/schema';
import { sql, isNull, count, eq, and, gte, lte } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
export class CustomerStatsRepository {
    async getStatusSummary(filters) {
        const { startDate, endDate, regionId, popId, oltId } = filters;
        const conditions = [isNull(customers.deletedAt)];
        const onuAlias = alias(onus, 'onu_cust_alias');
        const oltAlias = alias(olts, 'olt_cust_alias');
        const popAlias = alias(pops, 'pop_cust_alias');
        let query = db
            .select({
            status: customers.status,
            count: count(customers.id),
        })
            .from(customers);
        if (regionId || popId || oltId) {
            query = query.leftJoin(onuAlias, eq(customers.id, onuAlias.customerId));
            query = query.leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));
            query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
        }
        if (regionId)
            conditions.push(eq(popAlias.regionId, regionId));
        if (popId)
            conditions.push(eq(oltAlias.popId, popId));
        if (oltId)
            conditions.push(eq(onuAlias.oltId, oltId));
        if (startDate)
            conditions.push(gte(customers.createdAt, new Date(startDate)));
        if (endDate)
            conditions.push(lte(customers.createdAt, new Date(endDate)));
        return await query
            .where(and(...conditions))
            .groupBy(customers.status)
            .execute();
    }
    async getByRegion(filters) {
        const { startDate, endDate, regionId, popId, oltId } = filters;
        const conditions = [isNull(customers.deletedAt)];
        const onuAlias = alias(onus, 'onu_cust_alias');
        const oltAlias = alias(olts, 'olt_cust_alias');
        const popAlias = alias(pops, 'pop_cust_alias');
        let query = db
            .select({
            regionName: regions.name,
            count: count(customers.id),
        })
            .from(customers)
            .leftJoin(onuAlias, eq(customers.id, onuAlias.customerId))
            .leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id))
            .leftJoin(popAlias, eq(oltAlias.popId, popAlias.id))
            .leftJoin(regions, eq(popAlias.regionId, regions.id));
        if (regionId)
            conditions.push(eq(regions.id, regionId));
        if (popId)
            conditions.push(eq(oltAlias.popId, popId));
        if (oltId)
            conditions.push(eq(onuAlias.oltId, oltId));
        if (startDate)
            conditions.push(gte(customers.createdAt, new Date(startDate)));
        if (endDate)
            conditions.push(lte(customers.createdAt, new Date(endDate)));
        return await query
            .where(and(...conditions))
            .groupBy(regions.name)
            .execute();
    }
    async getByPop(filters) {
        const { startDate, endDate, regionId, popId, oltId } = filters;
        const conditions = [isNull(customers.deletedAt)];
        const onuAlias = alias(onus, 'onu_cust_alias');
        const oltAlias = alias(olts, 'olt_cust_alias');
        let query = db
            .select({
            popName: pops.name,
            count: count(customers.id),
        })
            .from(customers)
            .leftJoin(onuAlias, eq(customers.id, onuAlias.customerId))
            .leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id))
            .leftJoin(pops, eq(oltAlias.popId, pops.id));
        if (regionId)
            conditions.push(eq(pops.regionId, regionId));
        if (popId)
            conditions.push(eq(pops.id, popId));
        if (oltId)
            conditions.push(eq(onuAlias.oltId, oltId));
        if (startDate)
            conditions.push(gte(customers.createdAt, new Date(startDate)));
        if (endDate)
            conditions.push(lte(customers.createdAt, new Date(endDate)));
        return await query
            .where(and(...conditions))
            .groupBy(pops.name)
            .execute();
    }
    async getTrend(interval, filters) {
        const { startDate, endDate, regionId, popId, oltId } = filters;
        const conditions = [isNull(customers.deletedAt)];
        const onuAlias = alias(onus, 'onu_cust_alias');
        const oltAlias = alias(olts, 'olt_cust_alias');
        const popAlias = alias(pops, 'pop_cust_alias');
        const rawSqlString = `date_trunc('${interval}', ${customers.createdAt.name})`;
        let query = db
            .select({
            time: sql.raw(rawSqlString).as('time'),
            count: count(customers.id),
        })
            .from(customers);
        if (regionId || popId || oltId) {
            query = query.leftJoin(onuAlias, eq(customers.id, onuAlias.customerId));
            query = query.leftJoin(oltAlias, eq(onuAlias.oltId, oltAlias.id));
            query = query.leftJoin(popAlias, eq(oltAlias.popId, popAlias.id));
        }
        if (regionId)
            conditions.push(eq(popAlias.regionId, regionId));
        if (popId)
            conditions.push(eq(oltAlias.popId, popId));
        if (oltId)
            conditions.push(eq(onuAlias.oltId, oltId));
        if (startDate)
            conditions.push(gte(customers.createdAt, new Date(startDate)));
        if (endDate)
            conditions.push(lte(customers.createdAt, new Date(endDate)));
        return await query
            .where(and(...conditions))
            .groupBy(sql.raw(rawSqlString))
            .orderBy(sql.raw(rawSqlString))
            .execute();
    }
}

import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db, pool } from '../../../db';
import { sql } from 'drizzle-orm';
import { OltRepository } from '../olt.repository';
import { OltService } from '../olt.service';
import { NotFoundError, ConflictError } from '../../../lib/errors';
import { pops, regions } from '../../../db/schema';
let oltRepository;
let oltService;
let testPopId;
let testRegionId;
const clearTables = async () => {
    await db.execute(sql `TRUNCATE TABLE "olts", "pops", "regions" CASCADE;`);
};
before(async () => {
    oltRepository = new OltRepository();
    oltService = new OltService(oltRepository);
});
beforeEach(async () => {
    await clearTables();
    // Seed a test POP and Region for foreign key reference
    const [region] = await db.insert(regions).values({
        name: 'Test Region for OLT Service',
        description: 'Region for OLT service tests',
    }).returning();
    if (!region)
        throw new Error('Failed to seed Test Region for OLT Service');
    testRegionId = region.id;
    const [pop] = await db.insert(pops).values({
        name: 'Test POP for OLT Service',
        regionId: testRegionId,
        description: 'POP for OLT service tests',
    }).returning();
    if (!pop)
        throw new Error('Failed to seed Test POP for OLT Service');
    testPopId = pop.id;
});
after(async () => {
    await pool.end();
});
test('OltService: create OLT successfully', async () => {
    const newOlt = {
        name: 'OLT001',
        vendor: 'Huawei',
        ipAddress: '192.168.1.1',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16, // Added portCount
    };
    const olt = await oltService.createOlt(newOlt);
    assert.ok(olt);
    assert.strictEqual(olt.name, 'OLT001');
});
test('OltService: create OLT with duplicate name throws ConflictError', async () => {
    const newOlt = {
        name: 'OLT002',
        vendor: 'Huawei',
        ipAddress: '192.168.1.2',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16, // Added portCount
    };
    await oltService.createOlt(newOlt);
    const duplicateOlt = {
        name: 'OLT002', // Duplicate name
        vendor: 'ZTE',
        ipAddress: '192.168.1.3',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16, // Added portCount
    };
    await assert.rejects(oltService.createOlt(duplicateOlt), ConflictError);
});
test('OltService: get OLT by ID', async () => {
    const newOlt = {
        name: 'OLT003',
        vendor: 'Huawei',
        ipAddress: '192.168.1.4',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16, // Added portCount
    };
    const created = await oltService.createOlt(newOlt);
    assert.ok(created);
    const found = await oltService.getOlt(created.id);
    assert.ok(found);
    assert.strictEqual(found.id, created.id);
});
test('OltService: get non-existent OLT throws NotFoundError', async () => {
    await assert.rejects(oltService.getOlt('123e4567-e89b-12d3-a456-426614174000'), NotFoundError);
});
test('OltService: update OLT successfully', async () => {
    const newOlt = {
        name: 'OLT004',
        vendor: 'Huawei',
        ipAddress: '192.168.1.5',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16, // Added portCount
    };
    const created = await oltService.createOlt(newOlt);
    assert.ok(created);
    const updated = await oltService.updateOlt(created.id, { name: 'Updated OLT004' });
    assert.ok(updated);
    assert.strictEqual(updated.name, 'Updated OLT004');
});
test('OltService: update non-existent OLT throws NotFoundError', async () => {
    await assert.rejects(oltService.updateOlt('123e4567-e89b-12d3-a456-426614174000', { name: 'Non Existent' }), NotFoundError);
});
test('OltService: delete OLT successfully', async () => {
    const newOlt = {
        name: 'OLT005',
        vendor: 'Huawei',
        ipAddress: '192.168.1.6',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16, // Added portCount
    };
    const created = await oltService.createOlt(newOlt);
    assert.ok(created);
    const deleted = await oltService.deleteOlt(created.id);
    assert.ok(deleted);
    await assert.rejects(oltService.getOlt(created.id), NotFoundError);
});
test('OltService: delete non-existent OLT throws NotFoundError', async () => {
    await assert.rejects(oltService.deleteOlt('123e4567-e89b-12d3-a456-426614174000'), NotFoundError);
});

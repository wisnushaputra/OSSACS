import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db, pool } from '../../../db';
import { sql } from 'drizzle-orm';
import { OltRepository } from '../olt.repository';
import { pops } from '../../../db/schema/pop';
import { regions } from '../../../db/schema/region'; // Import regions
let oltRepository;
let testPopId;
const clearTables = async () => {
    await db.execute(sql `TRUNCATE TABLE "olts", "pops", "regions" CASCADE;`);
};
before(async () => {
    oltRepository = new OltRepository();
});
beforeEach(async () => {
    await clearTables();
    // Seed a test POP and Region for foreign key reference
    const [region] = await db.insert(regions).values({
        name: 'Test Region for OLT',
        description: 'Region for OLT tests',
    }).returning();
    if (!region)
        throw new Error('Failed to seed Test Region');
    const [pop] = await db.insert(pops).values({
        name: 'Test POP for OLT',
        regionId: region.id,
        description: 'POP for OLT tests',
    }).returning();
    if (!pop)
        throw new Error('Failed to seed Test POP');
    testPopId = pop.id;
});
after(async () => {
    await pool.end();
});
test('OltRepository: create OLT', async () => {
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
        portCount: 16,
    };
    // passwordHash is added at the service level, not directly in repository create input
    const olt = await oltRepository.create({ ...newOlt, passwordHash: 'hashedpassword' });
    assert.ok(olt);
    assert.strictEqual(olt.name, 'OLT001');
});
test('OltRepository: find by id', async () => {
    const newOlt = {
        name: 'OLT002',
        vendor: 'ZTE',
        ipAddress: '192.168.1.2',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16,
    };
    const created = await oltRepository.create({ ...newOlt, passwordHash: 'hashedpassword' });
    assert.ok(created);
    const found = await oltRepository.findById(created.id);
    assert.ok(found);
    assert.strictEqual(found.id, created.id);
});
test('OltRepository: find by name', async () => {
    const newOlt = {
        name: 'OLT003',
        vendor: 'Fiberhome',
        ipAddress: '192.168.1.3',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16,
    };
    await oltRepository.create({ ...newOlt, passwordHash: 'hashedpassword' });
    const found = await oltRepository.findByName('OLT003');
    assert.ok(found);
    assert.strictEqual(found.name, 'OLT003');
});
test('OltRepository: list OLTs with pagination', async () => {
    await oltRepository.create({
        name: 'OLT004',
        vendor: 'VSOL',
        ipAddress: '192.168.1.4',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16,
        passwordHash: 'hashedpassword',
    });
    await oltRepository.create({
        name: 'OLT005',
        vendor: 'Nokia',
        ipAddress: '192.168.1.5',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16,
        passwordHash: 'hashedpassword',
    });
    const result = await oltRepository.list({ limit: 1, offset: 0 });
    assert.strictEqual(result.data.length, 1);
    assert.strictEqual(result.total, 2);
    assert.strictEqual(result.limit, 1);
});
test('OltRepository: update OLT', async () => {
    const newOlt = {
        name: 'OLT006',
        vendor: 'Raisecom',
        ipAddress: '192.168.1.6',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16,
    };
    const created = await oltRepository.create({ ...newOlt, passwordHash: 'hashedpassword' });
    assert.ok(created);
    const updated = await oltRepository.update(created.id, { name: 'Updated OLT006' });
    assert.ok(updated);
    assert.strictEqual(updated.name, 'Updated OLT006');
});
test('OltRepository: delete OLT', async () => {
    const newOlt = {
        name: 'OLT007',
        vendor: 'VendorX',
        ipAddress: '192.168.1.7',
        port: '23',
        username: 'admin',
        password: 'testpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
        portCount: 16,
    };
    const created = await oltRepository.create({ ...newOlt, passwordHash: 'hashedpassword' });
    assert.ok(created);
    const deleted = await oltRepository.delete(created.id);
    assert.ok(deleted);
    const found = await oltRepository.findById(created.id);
    assert.strictEqual(found, undefined);
});

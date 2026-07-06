import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db, pool } from '../../../db';
import { sql } from 'drizzle-orm';
import { customers, olts, pops, regions } from '../../../db/schema'; // Import all necessary schemas
import { OnuRepository } from '../onu.repository';
let onuRepository;
let testCustomerId;
let testOltId;
let testPopId;
let testRegionId;
const clearTables = async () => {
    await db.execute(sql `TRUNCATE TABLE "onus", "customers", "olts", "pops", "regions" CASCADE;`);
};
before(async () => {
    onuRepository = new OnuRepository();
});
beforeEach(async () => {
    await clearTables();
    // Seed Region
    const [region] = await db.insert(regions).values({
        name: 'ONU Test Region',
        description: 'Region for ONU tests',
    }).returning();
    if (!region)
        throw new Error('Failed to seed ONU Test Region');
    testRegionId = region.id;
    // Seed POP
    const [pop] = await db.insert(pops).values({
        name: 'ONU Test POP',
        regionId: testRegionId,
        description: 'POP for ONU tests',
    }).returning();
    if (!pop)
        throw new Error('Failed to seed ONU Test POP');
    testPopId = pop.id;
    // Seed Customer
    const [customer] = await db.insert(customers).values({
        customerCode: 'CUSTONU',
        fullName: 'Test Customer ONU',
        status: 'Active',
    }).returning();
    if (!customer)
        throw new Error('Failed to seed Test Customer');
    testCustomerId = customer.id;
    // Seed OLT
    const [olt] = await db.insert(olts).values({
        name: 'OLT-ONU-TEST',
        vendor: 'Huawei',
        ipAddress: '10.0.0.10',
        port: '23',
        username: 'admin',
        passwordHash: 'hashedpassword',
        transport: 'telnet',
        status: 'active',
        popId: testPopId,
    }).returning();
    if (!olt)
        throw new Error('Failed to seed Test OLT');
    testOltId = olt.id;
});
after(async () => {
    await pool.end();
});
test('OnuRepository: create ONU', async () => {
    const newOnu = {
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST001',
        genieDeviceId: 'GDIDTEST001',
        ponPort: 'PON 1/1',
        onuId: 1,
        profileName: 'Internet-100M',
        vlan: 100,
    };
    const onu = await onuRepository.create(newOnu);
    assert.ok(onu);
    assert.strictEqual(onu.serialNumber, 'SNTEST001');
});
test('OnuRepository: find by id', async () => {
    const newOnu = {
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST002',
        genieDeviceId: 'GDIDTEST002',
        ponPort: 'PON 1/2',
        onuId: 2,
        profileName: 'Internet-200M',
        vlan: 200,
    };
    const created = await onuRepository.create(newOnu);
    assert.ok(created);
    const found = await onuRepository.findById(created.id);
    assert.ok(found);
    assert.strictEqual(found.id, created.id);
});
test('OnuRepository: find by serial number', async () => {
    const newOnu = {
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST003',
        genieDeviceId: 'GDIDTEST003',
        ponPort: 'PON 1/3',
        onuId: 3,
        profileName: 'Internet-300M',
        vlan: 300,
    };
    await onuRepository.create(newOnu);
    const found = await onuRepository.findBySerialNumber('SNTEST003');
    assert.ok(found);
    assert.strictEqual(found.serialNumber, 'SNTEST003');
});
test('OnuRepository: find by genie device id', async () => {
    const newOnu = {
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST004',
        genieDeviceId: 'GDIDTEST004',
        ponPort: 'PON 1/4',
        onuId: 4,
        profileName: 'Internet-400M',
        vlan: 400,
    };
    await onuRepository.create(newOnu);
    const found = await onuRepository.findByGenieDeviceId('GDIDTEST004');
    assert.ok(found);
    assert.strictEqual(found.genieDeviceId, 'GDIDTEST004');
});
test('OnuRepository: list ONUs with pagination', async () => {
    await onuRepository.create({
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST005',
        genieDeviceId: 'GDIDTEST005',
        ponPort: 'PON 1/5',
        onuId: 5,
        profileName: 'Internet-500M',
        vlan: 500,
    });
    await onuRepository.create({
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST006',
        genieDeviceId: 'GDIDTEST006',
        ponPort: 'PON 1/6',
        onuId: 6,
        profileName: 'Internet-600M',
        vlan: 600,
    });
    const result = await onuRepository.list({ limit: 1, offset: 0 });
    assert.strictEqual(result.data.length, 1);
    assert.strictEqual(result.total, 2);
    assert.strictEqual(result.limit, 1);
});
test('OnuRepository: update ONU', async () => {
    const newOnu = {
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST007',
        genieDeviceId: 'GDIDTEST007',
        ponPort: 'PON 1/7',
        onuId: 7,
        profileName: 'Internet-700M',
        vlan: 700,
    };
    const created = await onuRepository.create(newOnu);
    assert.ok(created);
    const updated = await onuRepository.update(created.id, { profileName: 'Updated-Internet-700M' });
    assert.ok(updated);
    assert.strictEqual(updated.profileName, 'Updated-Internet-700M');
});
test('OnuRepository: delete ONU', async () => {
    const newOnu = {
        customerId: testCustomerId,
        oltId: testOltId,
        serialNumber: 'SNTEST008',
        genieDeviceId: 'GDIDTEST008',
        ponPort: 'PON 1/8',
        onuId: 8,
        profileName: 'Internet-800M',
        vlan: 800,
    };
    const created = await onuRepository.create(newOnu);
    assert.ok(created);
    const deleted = await onuRepository.delete(created.id);
    assert.ok(deleted);
    const found = await onuRepository.findById(created.id);
    assert.strictEqual(found, undefined);
});

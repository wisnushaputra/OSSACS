import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db, pool } from '../../../db';
import { sql } from 'drizzle-orm';
import { OnuRepository } from '../onu.repository';
import { OnuService } from '../onu.service';
import { CreateOnuInput } from '../onu.schema';
import { NotFoundError, ConflictError } from '../../../lib/errors';
import { customers, olts, pops, regions } from '../../../db/schema';

let onuRepository: OnuRepository;
let onuService: OnuService;
let testCustomerId: string;
let testOltId: string;
let testPopId: string;
let testRegionId: string;

const clearTables = async () => {
  await db.execute(sql`TRUNCATE TABLE "onus", "pon_ports", "olts", "customers", "pops", "regions" CASCADE;`);
};

before(async () => {
  onuRepository = new OnuRepository();
  onuService = new OnuService(onuRepository);
});

beforeEach(async () => {
  await clearTables();

  // Seed Region
  const [region] = await db.insert(regions).values({
    name: 'ONU Service Test Region',
    description: 'Region for ONU service tests',
  }).returning();
  if (!region) throw new Error('Failed to seed ONU Service Test Region');
  testRegionId = region.id;

  // Seed POP
  const [pop] = await db.insert(pops).values({
    name: 'ONU Service Test POP',
    regionId: testRegionId,
    description: 'POP for ONU service tests',
  }).returning();
  if (!pop) throw new Error('Failed to seed ONU Service Test POP');
  testPopId = pop.id;

  // Seed Customer
  const [customer] = await db.insert(customers).values({
    customerCode: 'CUST-ONU-SERVICE',
    fullName: 'Test Customer ONU Service',
    status: 'Active',
  }).returning();
  if (!customer) throw new Error('Failed to seed Test Customer for ONU Service');
  testCustomerId = customer.id;

  // Seed OLT
  const [olt] = await db.insert(olts).values({
    name: 'OLT-ONU-SERVICE-TEST',
    vendor: 'Huawei',
    ipAddress: '10.0.0.11',
    port: '23',
    username: 'admin',
    passwordHash: 'hashedpassword',
    transport: 'telnet',
    status: 'active',
    popId: testPopId,
  }).returning();
  if (!olt) throw new Error('Failed to seed Test OLT for ONU Service');
  testOltId = olt.id;
});

after(async () => {
  await pool.end();
});

test('OnuService: create ONU successfully', async () => {
  const newOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-001',
    genieDeviceId: 'GDID-SERVICE-001',
    ponPort: 'PON 1/1',
    onuId: 1,
    profileName: 'Internet-100M',
    vlan: 100,
  };
  const onu = await onuService.createOnu(newOnu);
  assert.ok(onu);
  assert.strictEqual(onu.serialNumber, 'SN-SERVICE-001');
});

test('OnuService: create ONU with duplicate serial number throws ConflictError', async () => {
  const newOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-002',
    genieDeviceId: 'GDID-SERVICE-002',
    ponPort: 'PON 1/2',
    onuId: 2,
    profileName: 'Internet-200M',
    vlan: 200,
  };
  await onuService.createOnu(newOnu);

  const duplicateOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-002', // Duplicate serial
    genieDeviceId: 'GDID-SERVICE-003',
    ponPort: 'PON 1/3',
    onuId: 3,
    profileName: 'Internet-300M',
    vlan: 300,
  };
  await assert.rejects(onuService.createOnu(duplicateOnu), ConflictError);
});

test('OnuService: create ONU with duplicate genie device id throws ConflictError', async () => {
  const newOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-004',
    genieDeviceId: 'GDID-SERVICE-004',
    ponPort: 'PON 1/4',
    onuId: 4,
    profileName: 'Internet-400M',
    vlan: 400,
  };
  await onuService.createOnu(newOnu);

  const duplicateOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-005',
    genieDeviceId: 'GDID-SERVICE-004', // Duplicate genie device id
    ponPort: 'PON 1/5',
    onuId: 5,
    profileName: 'Internet-500M',
    vlan: 500,
  };
  await assert.rejects(onuService.createOnu(duplicateOnu), ConflictError);
});

test('OnuService: get ONU by ID', async () => {
  const newOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-006',
    genieDeviceId: 'GDID-SERVICE-006',
    ponPort: 'PON 1/6',
    onuId: 6,
    profileName: 'Internet-600M',
    vlan: 600,
  };
  const created = await onuService.createOnu(newOnu);
  const found = await onuService.getOnu(created.id);
  assert.ok(found);
  assert.strictEqual(found.id, created.id);
});

test('OnuService: get non-existent ONU throws NotFoundError', async () => {
  await assert.rejects(onuService.getOnu('123e4567-e89b-12d3-a456-426614174000'), NotFoundError);
});

test('OnuService: update ONU successfully', async () => {
  const newOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-007',
    genieDeviceId: 'GDID-SERVICE-007',
    ponPort: 'PON 1/7',
    onuId: 7,
    profileName: 'Internet-700M',
    vlan: 700,
  };
  const created = await onuService.createOnu(newOnu);
  const updated = await onuService.updateOnu(created.id, { profileName: 'Updated-Internet-700M' });
  assert.ok(updated);
  assert.strictEqual(updated.profileName, 'Updated-Internet-700M');
});

test('OnuService: update non-existent ONU throws NotFoundError', async () => {
  await assert.rejects(
    onuService.updateOnu('123e4567-e89b-12d3-a456-426614174000', { profileName: 'Non Existent' }),
    NotFoundError,
  );
});

test('OnuService: delete ONU successfully', async () => {
  const newOnu: CreateOnuInput = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'SN-SERVICE-008',
    genieDeviceId: 'GDID-SERVICE-008',
    ponPort: 'PON 1/8',
    onuId: 8,
    profileName: 'Internet-800M',
    vlan: 800,
  };
  const created = await onuService.createOnu(newOnu);
  const deleted = await onuService.deleteOnu(created.id);
  assert.ok(deleted);
  await assert.rejects(onuService.getOnu(created.id), NotFoundError);
});

test('OnuService: delete non-existent ONU throws NotFoundError', async () => {
  await assert.rejects(onuService.deleteOnu('123e4567-e89b-12d3-a456-426614174000'), NotFoundError);
});

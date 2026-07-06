import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { FastifyInstance } from 'fastify';
import { createServer } from '../../../server';
import { db, pool } from '../../../db';
import { users, roles, refreshTokens, auditLogs, onus, customers, olts, pops, regions } from '../../../db/schema';
import { sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { myQueue } from '../../../lib/queue';

let server: FastifyInstance;
let accessToken: string;
let testCustomerId: string;
let testOltId: string;

const clearTables = async () => {
  await db.execute(sql`TRUNCATE TABLE "refresh_tokens", "audit_logs", "users", "roles", "onus", "customers", "olts", "pops", "regions" CASCADE;`);
};

const seedAuth = async () => {
  const [role] = await db.insert(roles).values({ name: 'TestAPIOnu', description: 'Test API' }).returning();
  if (!role) throw new Error('Failed to seed role');
  const passwordHash = await bcrypt.hash('testpassword', 10);
  await db.insert(users).values({
    username: 'testapi',
    fullname: 'Test API',
    email: 'testapi@example.com',
    roleId: role.id,
    passwordHash,
    isActive: true,
  });
  const login = await server.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: { username: 'testapi', password: 'testpassword' },
  });
  accessToken = JSON.parse(login.payload).data.accessToken;
};

const seedOnuDeps = async () => {
  const [region] = await db.insert(regions).values({ name: 'API Test Region' }).returning();
  if (!region) throw new Error('Failed to seed region');
  const [pop] = await db.insert(pops).values({ name: 'API Test POP', regionId: region.id }).returning();
  if (!pop) throw new Error('Failed to seed pop');

  const [customer] = await db.insert(customers).values({
    customerCode: 'CUST-API',
    fullName: 'API Customer',
    status: 'Active',
  }).returning();
  if (!customer) throw new Error('Failed to seed customer');
  testCustomerId = customer.id;

  const [olt] = await db.insert(olts).values({
    name: 'OLT-API',
    vendor: 'Huawei',
    ipAddress: '10.0.0.1',
    port: '23',
    username: 'admin',
    passwordHash: 'hashed',
    transport: 'telnet',
    status: 'active',
    popId: pop.id,
  }).returning();
  if (!olt) throw new Error('Failed to seed olt');
  testOltId = olt.id;
};

before(async () => {
  server = createServer();
  await server.ready();
});

beforeEach(async () => {
  await clearTables();
  await seedAuth();
  await seedOnuDeps();
});

after(async () => {
  await clearTables();
  await server.close();
  await myQueue.close();
  await pool.end();
});

test('API: POST /api/v1/onus - success', async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/api/v1/onus',
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: {
      customerId: testCustomerId,
      oltId: testOltId,
      serialNumber: 'API-ONU-001',
      genieDeviceId: 'API-GDID-001',
      ponPort: 'PON 1/1',
      onuId: 1,
      profileName: 'Internet',
      vlan: 100,
    },
  });
  assert.strictEqual(response.statusCode, 201);
});

test('API: POST /api/v1/onus - duplicate serial (409)', async () => {
  const payload = {
    customerId: testCustomerId,
    oltId: testOltId,
    serialNumber: 'API-ONU-DUP',
    genieDeviceId: 'API-GDID-DUP',
    ponPort: 'PON 1/1',
    onuId: 1,
    profileName: 'Internet',
    vlan: 100,
  };
  await server.inject({
    method: 'POST',
    url: '/api/v1/onus',
    headers: { Authorization: `Bearer ${accessToken}` },
    payload,
  });
  const response = await server.inject({
    method: 'POST',
    url: '/api/v1/onus',
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: { ...payload, genieDeviceId: 'API-GDID-DUP-2' },
  });
  assert.strictEqual(response.statusCode, 409);
});

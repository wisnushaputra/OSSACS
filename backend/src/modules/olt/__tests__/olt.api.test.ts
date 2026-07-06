import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { FastifyInstance } from 'fastify';
import { createServer } from '../../../server';
import { db, pool } from '../../../db';
import { users, roles, refreshTokens, auditLogs, olts, pops, regions } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { myQueue } from '../../../lib/queue';

let server: FastifyInstance;
let accessToken: string;
let testPopId: string;

const clearTables = async () => {
  await db.execute(sql`TRUNCATE TABLE "refresh_tokens", "audit_logs", "users", "roles", "olts", "pops", "regions" CASCADE;`);
};

const seedAuth = async () => {
  const [role] = await db.insert(roles).values({ name: 'TestAPIOlt', description: 'Test API' }).returning();
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

const seedPop = async () => {
  const [region] = await db.insert(regions).values({ name: 'API Test Region' }).returning();
  if (!region) throw new Error('Failed to seed region');
  const [pop] = await db.insert(pops).values({ name: 'API Test POP', regionId: region.id }).returning();
  if (!pop) throw new Error('Failed to seed pop');
  testPopId = pop.id;
};

before(async () => {
  server = createServer();
  await server.ready();
});

beforeEach(async () => {
  await clearTables();
  await seedAuth();
  await seedPop();
});

after(async () => {
  await clearTables();
  await server.close();
  await myQueue.close();
  await pool.end();
});

test('API: POST /api/v1/olts - success', async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/api/v1/olts',
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: {
      name: 'API-OLT-001',
      vendor: 'Huawei',
      ipAddress: '10.0.0.1',
      port: '23',
      username: 'admin',
      password: 'testpassword',
      popId: testPopId,
    },
  });
  assert.strictEqual(response.statusCode, 201);
});

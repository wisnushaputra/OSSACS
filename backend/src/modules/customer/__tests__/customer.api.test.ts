import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { FastifyInstance } from 'fastify';
import { createServer } from '../../../server';
import { db, pool } from '../../../db';
import { users, roles, refreshTokens, auditLogs, customers } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { myQueue } from '../../../lib/queue';

let server: FastifyInstance;
let accessToken: string;

const clearTables = async () => {
  await db.execute(sql`TRUNCATE TABLE "refresh_tokens", "audit_logs", "users", "roles", "customers" CASCADE;`);
};

const seedAuth = async () => {
  const [role] = await db.insert(roles).values({ name: 'TestAPI', description: 'Test API' }).returning();
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
  const body = JSON.parse(login.payload);
  accessToken = body.data.accessToken;
};

before(async () => {
  server = createServer();
  await server.ready();
  await seedAuth();
});

beforeEach(async () => {
  await clearTables();
  await seedAuth();
});

after(async () => {
  await clearTables();
  await server.close();
  await myQueue.close();
  await pool.end();
});

test('API: POST /api/v1/customers - success', async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/api/v1/customers',
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: { customerCode: 'API-CUST-001', fullName: 'API Customer 1' },
  });
  assert.strictEqual(response.statusCode, 201);
});

test('API: POST /api/v1/customers - duplicate (409)', async () => {
  await server.inject({
    method: 'POST',
    url: '/api/v1/customers',
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: { customerCode: 'DUP-001', fullName: 'Duplicate 1' },
  });
  const response = await server.inject({
    method: 'POST',
    url: '/api/v1/customers',
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: { customerCode: 'DUP-001', fullName: 'Duplicate 2' },
  });
  assert.strictEqual(response.statusCode, 409);
});

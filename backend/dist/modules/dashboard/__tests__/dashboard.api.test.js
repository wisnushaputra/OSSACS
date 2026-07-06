import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { createServer } from '../../../server';
import { db, pool } from '../../../db';
import { users, roles, rolePermissions, permissions } from '../../../db/schema';
import { sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { myQueue } from '../../../lib/queue';
import { redis } from '../../../lib/cache';
let server;
let accessToken;
const clearTables = async () => {
    await db.execute(sql `TRUNCATE TABLE "refresh_tokens", "audit_logs", "users", "roles", "customers", "permissions", "role_permissions" CASCADE;`);
};
const seedAuth = async () => {
    const [perm] = await db.insert(permissions).values({ name: 'dashboard:read', description: 'Read dashboard' }).returning();
    const [role] = await db.insert(roles).values({ name: 'TestAPI', description: 'Test API' }).returning();
    await db.insert(rolePermissions).values({ roleId: role.id, permissionId: perm.id });
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
    await clearTables();
    await seedAuth();
});
after(async () => {
    await clearTables();
    await server.close();
    await myQueue.close();
    await redis.quit();
    await pool.end();
});
test('API: GET /api/v1/dashboard/summary - success', async () => {
    const response = await server.inject({
        method: 'GET',
        url: '/api/v1/dashboard/summary',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert.strictEqual(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.data.totalCustomers === 'number');
    assert.ok(typeof body.data.activeAlarms === 'number');
});
test('API: GET /api/v1/dashboard/summary?regionId=... - success with filters', async () => {
    const response = await server.inject({
        method: 'GET',
        url: '/api/v1/dashboard/summary?regionId=00000000-0000-0000-0000-000000000000',
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert.strictEqual(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    assert.strictEqual(body.success, true);
});

import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { createServer } from '../../server';
import { db, pool } from '../../db';
import { users, roles } from '../../db/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { myQueue } from '../../lib/queue';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
const execPromise = promisify(exec);
let server;
const clearTables = async () => {
    try {
        // Truncate all tables in the correct order, with CASCADE to handle foreign keys
        await db.execute(sql `TRUNCATE TABLE "refresh_tokens", "audit_logs", "users", "roles" CASCADE;`);
    }
    catch (error) {
        console.error('clearTables failed:', error);
        throw error;
    }
};
const seedUser = async () => {
    const [roleRecord] = await db.insert(roles)
        .values({ name: 'TestRole', description: 'Test role' })
        .returning();
    if (!roleRecord)
        throw new Error('Failed to seed TestRole');
    const passwordHash = await bcrypt.hash('testpassword', 10);
    const newUser = {
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        roleId: roleRecord.id,
        passwordHash,
        isActive: true,
    };
    await db.insert(users).values(newUser);
};
before(async () => {
    // Run migrations before tests
    console.log('Running Drizzle migrations...');
    try {
        const { stdout, stderr } = await execPromise('npm run db:migrate', { cwd: './' });
        console.log('Migrations stdout:', stdout);
        if (stderr)
            console.error('Migrations stderr:', stderr);
    }
    catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
    server = createServer();
    await server.ready();
});
after(async () => {
    await clearTables();
    await server.close();
    await myQueue.close();
    await pool.end();
});
test('auth smoke: login and refresh', async () => {
    await clearTables();
    await seedUser();
    const login = await server.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'testuser', password: 'testpassword' },
    });
    assert.strictEqual(login.statusCode, 200);
    const loginBody = JSON.parse(login.payload);
    assert.ok(loginBody.data.accessToken);
    assert.ok(loginBody.data.refreshToken);
    const refresh = await server.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
        payload: { refreshToken: loginBody.data.refreshToken },
    });
    assert.strictEqual(refresh.statusCode, 200);
    const refreshBody = JSON.parse(refresh.payload);
    assert.ok(refreshBody.data.accessToken);
    assert.ok(refreshBody.data.refreshToken);
});

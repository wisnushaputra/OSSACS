import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db, pool } from '../../../db';
import { sql } from 'drizzle-orm';
import { CustomerRepository } from '../customer.repository';
let customerRepository;
const clearTables = async () => {
    await db.execute(sql `TRUNCATE TABLE "customers" CASCADE;`);
};
before(async () => {
    customerRepository = new CustomerRepository();
});
beforeEach(async () => {
    await clearTables();
});
after(async () => {
    await pool.end();
});
test('CustomerRepository: create customer', async () => {
    const newCustomer = {
        customerCode: 'CUST001',
        fullName: 'Test Customer 1',
        email: 'test1@example.com',
        status: 'Active',
    };
    const customer = await customerRepository.create(newCustomer);
    assert.ok(customer);
    assert.strictEqual(customer.customerCode, 'CUST001');
});
test('CustomerRepository: find by id', async () => {
    const newCustomer = {
        customerCode: 'CUST002',
        fullName: 'Test Customer 2',
        status: 'Active',
    };
    const created = await customerRepository.create(newCustomer);
    assert.ok(created);
    const found = await customerRepository.findById(created.id);
    assert.ok(found);
    assert.strictEqual(found.id, created.id);
});
test('CustomerRepository: find by customer code', async () => {
    const newCustomer = {
        customerCode: 'CUST003',
        fullName: 'Test Customer 3',
        status: 'Active',
    };
    await customerRepository.create(newCustomer);
    const found = await customerRepository.findByCustomerCode('CUST003');
    assert.ok(found);
    assert.strictEqual(found.customerCode, 'CUST003');
});
test('CustomerRepository: list customers with pagination', async () => {
    await customerRepository.create({ customerCode: 'CUST004', fullName: 'Test Customer 4', status: 'Active' });
    await customerRepository.create({ customerCode: 'CUST005', fullName: 'Test Customer 5', status: 'Active' });
    const result = await customerRepository.list({ limit: 1, offset: 0 });
    assert.strictEqual(result.data.length, 1);
    assert.strictEqual(result.total, 2);
    assert.strictEqual(result.limit, 1);
});
test('CustomerRepository: update customer', async () => {
    const newCustomer = {
        customerCode: 'CUST006',
        fullName: 'Test Customer 6',
        status: 'Active',
    };
    const created = await customerRepository.create(newCustomer);
    assert.ok(created);
    const updated = await customerRepository.update(created.id, { fullName: 'Updated Customer 6' });
    assert.ok(updated);
    assert.strictEqual(updated.fullName, 'Updated Customer 6');
});
test('CustomerRepository: delete customer', async () => {
    const newCustomer = {
        customerCode: 'CUST007',
        fullName: 'Test Customer 7',
        status: 'Active',
    };
    const created = await customerRepository.create(newCustomer);
    assert.ok(created);
    const deleted = await customerRepository.delete(created.id);
    assert.ok(deleted);
    const found = await customerRepository.findById(created.id);
    assert.strictEqual(found, undefined);
});

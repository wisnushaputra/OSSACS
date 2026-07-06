import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { db, pool } from '../../../db';
import { sql } from 'drizzle-orm';
import { CustomerRepository } from '../customer.repository';
import { CustomerService } from '../customer.service';
import { NotFoundError, ConflictError } from '../../../lib/errors';
let customerRepository;
let customerService;
const clearTables = async () => {
    await db.execute(sql `TRUNCATE TABLE "customers" CASCADE;`);
};
before(async () => {
    customerRepository = new CustomerRepository();
    customerService = new CustomerService(customerRepository);
});
beforeEach(async () => {
    await clearTables();
});
after(async () => {
    await pool.end();
});
test('CustomerService: create customer successfully', async () => {
    const newCustomer = {
        customerCode: 'CUST001',
        fullName: 'Test Customer 1',
        status: 'Active',
    };
    const customer = await customerService.create(newCustomer);
    assert.ok(customer);
    assert.strictEqual(customer.customerCode, 'CUST001');
});
test('CustomerService: create customer with duplicate code throws ConflictError', async () => {
    const newCustomer = {
        customerCode: 'CUST001',
        fullName: 'Test Customer 1',
        status: 'Active',
    };
    await customerService.create(newCustomer);
    const duplicateCustomer = {
        customerCode: 'CUST001',
        fullName: 'Another Customer',
        status: 'Active',
    };
    await assert.rejects(customerService.create(duplicateCustomer), ConflictError);
});
test('CustomerService: get customer by ID', async () => {
    const newCustomer = {
        customerCode: 'CUST002',
        fullName: 'Test Customer 2',
        status: 'Active',
    };
    const created = await customerService.create(newCustomer);
    const found = await customerService.getCustomer(created.id);
    assert.ok(found);
    assert.strictEqual(found.id, created.id);
});
test('CustomerService: get non-existent customer throws NotFoundError', async () => {
    await assert.rejects(customerService.getCustomer('123e4567-e89b-12d3-a456-426614174000'), NotFoundError);
});
test('CustomerService: update customer successfully', async () => {
    const newCustomer = {
        customerCode: 'CUST003',
        fullName: 'Test Customer 3',
        status: 'Active',
    };
    const created = await customerService.create(newCustomer);
    const updated = await customerService.update(created.id, { fullName: 'Updated Customer 3' });
    assert.ok(updated);
    assert.strictEqual(updated.fullName, 'Updated Customer 3');
});
test('CustomerService: update non-existent customer throws NotFoundError', async () => {
    await assert.rejects(customerService.update('123e4567-e89b-12d3-a456-426614174000', { fullName: 'Non Existent' }), NotFoundError);
});
test('CustomerService: delete customer successfully', async () => {
    const newCustomer = {
        customerCode: 'CUST004',
        fullName: 'Test Customer 4',
        status: 'Active',
    };
    const created = await customerService.create(newCustomer);
    const deleted = await customerService.delete(created.id);
    assert.ok(deleted);
    await assert.rejects(customerService.getCustomer(created.id), NotFoundError);
});
test('CustomerService: delete non-existent customer throws NotFoundError', async () => {
    await assert.rejects(customerService.delete('123e4567-e89b-12d3-a456-426614174000'), NotFoundError);
});

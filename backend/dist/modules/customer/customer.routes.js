import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';
import { customerSchemas, } from './customer.schema';
import { z } from 'zod';
export async function customerRoutes(server) {
    const customerRepository = new CustomerRepository();
    const customerService = new CustomerService(customerRepository);
    const customerController = new CustomerController(customerService);
    server.get('/search', {
        preHandler: [server.authenticate],
        schema: {
            querystring: customerSchemas.customerSearchSchema,
            response: { 200: customerSchemas.customersPaginatedApiResponseSchema },
        },
    }, customerController.searchCustomers.bind(customerController));
    server.get('/', {
        preHandler: [server.authenticate],
        schema: {
            querystring: customerSchemas.paginationQuerySchema,
            response: { 200: customerSchemas.customersPaginatedApiResponseSchema },
        },
    }, customerController.listCustomers.bind(customerController));
    server.get('/:id', {
        preHandler: [server.authenticate],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: customerSchemas.customerApiResponseSchema },
        },
    }, customerController.getCustomer.bind(customerController));
    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: customerSchemas.createCustomerSchema,
            response: { 201: customerSchemas.customerApiResponseSchema },
        },
    }, customerController.createCustomer.bind(customerController));
    server.put('/:id', {
        preHandler: [server.authenticate],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            body: customerSchemas.updateCustomerSchema,
            response: { 200: customerSchemas.customerApiResponseSchema },
        },
    }, customerController.updateCustomer.bind(customerController));
    server.delete('/:id', {
        preHandler: [server.authenticate],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: customerSchemas.deleteCustomerResponseSchema },
        },
    }, customerController.deleteCustomer.bind(customerController));
    server.get('/by-code/:customerCode', {
        preHandler: [server.authenticate],
        schema: {
            params: z.object({ customerCode: z.string() }),
            response: { 200: customerSchemas.customerApiResponseSchema },
        },
    }, customerController.getCustomerByCode.bind(customerController));
}

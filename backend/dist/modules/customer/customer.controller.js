export class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    async listCustomers(request, reply) {
        const customers = await this.customerService.getCustomers({
            limit: request.query.limit,
            offset: request.query.offset,
        });
        return reply.send({ success: true, data: customers });
    }
    async searchCustomers(request, reply) {
        const customers = await this.customerService.searchCustomers({
            query: request.query.q,
            limit: request.query.limit,
            offset: request.query.offset,
        });
        return reply.send({ success: true, data: customers });
    }
    async getCustomer(request, reply) {
        const customer = await this.customerService.getCustomer(request.params.id);
        return reply.send({ success: true, data: customer });
    }
    async createCustomer(request, reply) {
        const customer = await this.customerService.create(request.body);
        return reply.status(201).send({
            success: true,
            data: customer,
        });
    }
    async updateCustomer(request, reply) {
        const customer = await this.customerService.update(request.params.id, request.body);
        return reply.send({
            success: true,
            data: customer,
        });
    }
    async deleteCustomer(request, reply) {
        await this.customerService.delete(request.params.id);
        return reply.send({ success: true, message: 'Customer deleted' });
    }
    async getCustomerByCode(request, reply) {
        const customer = await this.customerService.getCustomerByCode(request.params.customerCode);
        return reply.send({ success: true, data: customer });
    }
}

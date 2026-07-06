import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomerService } from './customer.service';
import { CreateCustomerInput, UpdateCustomerInput } from './customer.schema';

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async listCustomers(request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>, reply: FastifyReply) {
    const customers = await this.customerService.getCustomers({
      limit: request.query.limit,
      offset: request.query.offset,
    });
    return reply.send({ success: true, data: customers });
  }

  async searchCustomers(
    request: FastifyRequest<{ Querystring: { q?: string; limit?: number; offset?: number } }>,
    reply: FastifyReply,
  ) {
    const customers = await this.customerService.searchCustomers({
      query: request.query.q,
      limit: request.query.limit,
      offset: request.query.offset,
    });
    return reply.send({ success: true, data: customers });
  }

  async getCustomer(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const customer = await this.customerService.getCustomer(request.params.id);
    return reply.send({ success: true, data: customer });
  }

  async createCustomer(request: FastifyRequest<{ Body: CreateCustomerInput }>, reply: FastifyReply) {
    const customer = await this.customerService.create(request.body);
    return reply.status(201).send({
      success: true,
      data: customer,
    });
  }

  async updateCustomer(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateCustomerInput }>,
    reply: FastifyReply,
  ) {
    const customer = await this.customerService.update(request.params.id, request.body);
    return reply.send({
      success: true,
      data: customer,
    });
  }

  async deleteCustomer(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.customerService.delete(request.params.id);
    return reply.send({ success: true, message: 'Customer deleted' });
  }

  async getCustomerByCode(
    request: FastifyRequest<{ Params: { customerCode: string } }>,
    reply: FastifyReply,
  ) {
    const customer = await this.customerService.getCustomerByCode(request.params.customerCode);
    return reply.send({ success: true, data: customer });
  }
}
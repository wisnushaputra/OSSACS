import { FastifyReply, FastifyRequest } from 'fastify';
import { VendorService } from './vendor.service';
import { CreateVendorInput, UpdateVendorInput } from './vendor.schema';

export class VendorController {
  constructor(private vendorService: VendorService) {}

  async listVendors(request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>, reply: FastifyReply) {
    const limit = request.query.limit ? Number(request.query.limit) : undefined;
    const offset = request.query.offset ? Number(request.query.offset) : undefined;
    const vendorsResult = await this.vendorService.listVendors(limit, offset);
    return reply.send({ success: true, data: vendorsResult });
  }

  async getVendor(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const vendor = await this.vendorService.getVendor(request.params.id);
    return reply.send({ success: true, data: vendor });
  }

  async createVendor(request: FastifyRequest<{ Body: CreateVendorInput }>, reply: FastifyReply) {
    const vendor = await this.vendorService.createVendor(request.body);
    return reply.status(201).send({
      success: true,
      data: vendor,
    });
  }

  async updateVendor(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateVendorInput }>,
    reply: FastifyReply,
  ) {
    const vendor = await this.vendorService.updateVendor(request.params.id, request.body);
    return reply.send({
      success: true,
      data: vendor,
    });
  }

  async deleteVendor(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.vendorService.deleteVendor(request.params.id);
    return reply.send({ success: true, message: 'Vendor deleted' });
  }
}
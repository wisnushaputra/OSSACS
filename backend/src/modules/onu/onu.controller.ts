import { FastifyReply, FastifyRequest } from 'fastify';
import { OnuService } from './onu.service';
import { CreateOnuInput, UpdateOnuInput } from './onu.schema';

export class OnuController {
  constructor(private onuService: OnuService) {}

  async listOnus(
    request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>,
    reply: FastifyReply,
  ) {
    const onus = await this.onuService.listOnus({
      limit: request.query.limit,
      offset: request.query.offset,
    });
    return reply.send({ success: true, data: onus });
  }

  async searchOnus(
    request: FastifyRequest<{
      Querystring: {
        q?: string;
        customerId?: string;
        oltId?: string;
        vendor?: string;
        status?: string;
        limit?: number;
        offset?: number;
      };
    }>,
    reply: FastifyReply,
  ) {
    const onus = await this.onuService.searchOnus({
      query: request.query.q,
      customerId: request.query.customerId,
      oltId: request.query.oltId,
      vendor: request.query.vendor,
      status: request.query.status,
      limit: request.query.limit,
      offset: request.query.offset,
    });
    return reply.send({ success: true, data: onus });
  }

  async getOnu(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const onu = await this.onuService.getOnu(request.params.id);
    return reply.send({ success: true, data: onu });
  }

  async createOnu(request: FastifyRequest<{ Body: CreateOnuInput }>, reply: FastifyReply) {
    const onu = await this.onuService.createOnu(request.body);
    return reply.status(201).send({
      success: true,
      data: onu,
    });
  }

  async updateOnu(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateOnuInput }>,
    reply: FastifyReply,
  ) {
    const onu = await this.onuService.updateOnu(request.params.id, request.body);
    return reply.send({
      success: true,
      data: onu,
    });
  }

  async deleteOnu(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.onuService.deleteOnu(request.params.id);
    return reply.send({ success: true, message: 'ONU deleted' });
  }
}
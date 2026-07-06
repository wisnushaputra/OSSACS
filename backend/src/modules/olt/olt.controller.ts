import { FastifyReply, FastifyRequest } from 'fastify';
import { OltService } from './olt.service';
import { CreateOltInput, UpdateOltInput } from './olt.schema';

export class OltController {
  constructor(private oltService: OltService) {}

  async testConnection(request: FastifyRequest<{ Body: { ipAddress: string; port: string } }>, reply: FastifyReply) {
    const { ipAddress, port } = request.body;
    const isConnected = await this.oltService.testConnection(ipAddress, port);
    if (isConnected) {
      return reply.send({ success: true, message: 'Connection successful' });
    } else {
      return reply.status(400).send({ success: false, message: 'Connection failed' });
    }
  }

  async listOlts(request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>, reply: FastifyReply) {
    const olts = await this.oltService.listOLTs({
      limit: request.query.limit,
      offset: request.query.offset,
    });
    return reply.send({ success: true, data: olts });
  }

  async getOlt(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const olt = await this.oltService.getOlt(request.params.id);
    return reply.send({ success: true, data: olt });
  }

  async createOlt(request: FastifyRequest<{ Body: CreateOltInput }>, reply: FastifyReply) {
    const olt = await this.oltService.createOlt(request.body);
    return reply.status(201).send({
      success: true,
      data: olt,
    });
  }

  async updateOlt(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateOltInput }>,
    reply: FastifyReply,
  ) {
    const olt = await this.oltService.updateOlt(request.params.id, request.body);
    return reply.send({
      success: true,
      data: olt,
    });
  }

  async deleteOlt(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.oltService.deleteOlt(request.params.id);
    return reply.send({ success: true, message: 'OLT deleted' });
  }
}
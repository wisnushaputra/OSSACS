import { FastifyReply, FastifyRequest } from 'fastify';
import { PonPortService } from './pon-port.service';
import { UpdatePonPortInput } from './pon-port.schema';

export class PonPortController {
  constructor(private ponPortService: PonPortService) {}

  async listPonPorts(
    request: FastifyRequest<{ Params: { oltId: string }; Querystring: { limit?: number; offset?: number } }>,
    reply: FastifyReply,
  ) {
    const { oltId } = request.params;
    const ports = await this.ponPortService.listPonPortsByOlt(oltId, {
      limit: request.query.limit,
      offset: request.query.offset,
    });
    return reply.send({ success: true, data: ports });
  }

  async getPonPort(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const port = await this.ponPortService.getPonPort(request.params.id);
    return reply.send({ success: true, data: port });
  }

  async updatePonPort(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdatePonPortInput }>,
    reply: FastifyReply,
  ) {
    const port = await this.ponPortService.updatePonPort(request.params.id, request.body);
    return reply.send({
      success: true,
      data: port,
    });
  }
}
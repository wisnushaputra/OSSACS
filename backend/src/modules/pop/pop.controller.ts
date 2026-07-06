import { FastifyReply, FastifyRequest } from 'fastify';
import { PopService } from './pop.service';
import { CreatePopInput, UpdatePopInput } from './schemas';

export class PopController {
  constructor(private popService: PopService) {}

  async listPops(
    request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>,
    reply: FastifyReply,
  ) {
    const limit = request.query.limit ? Number(request.query.limit) : undefined;
    const offset = request.query.offset ? Number(request.query.offset) : undefined;
    const result = await this.popService.listPops(limit, offset);
    return reply.send({ success: true, data: result });
  }

  async getPop(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const pop = await this.popService.getPop(request.params.id);
    return reply.send({ success: true, data: pop });
  }

  async createPop(request: FastifyRequest<{ Body: CreatePopInput }>, reply: FastifyReply) {
    const pop = await this.popService.createPop(request.body);
    return reply.status(201).send({ success: true, data: pop });
  }

  async updatePop(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdatePopInput }>,
    reply: FastifyReply,
  ) {
    const pop = await this.popService.updatePop(request.params.id, request.body);
    return reply.send({ success: true, data: pop });
  }

  async deletePop(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.popService.deletePop(request.params.id);
    return reply.send({ success: true, message: 'Pop deleted' });
  }
}

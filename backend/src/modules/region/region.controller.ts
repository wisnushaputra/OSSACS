import { FastifyReply, FastifyRequest } from 'fastify';
import { RegionService } from './region.service';
import { CreateRegionInput, UpdateRegionInput } from './schemas';

export class RegionController {
  constructor(private regionService: RegionService) {}

  async listRegions(
    request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>,
    reply: FastifyReply,
  ) {
    const limit = request.query.limit ? Number(request.query.limit) : undefined;
    const offset = request.query.offset ? Number(request.query.offset) : undefined;
    const result = await this.regionService.listRegions(limit, offset);
    return reply.send({ success: true, data: result });
  }

  async getRegion(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const region = await this.regionService.getRegion(request.params.id);
    return reply.send({ success: true, data: region });
  }

  async createRegion(request: FastifyRequest<{ Body: CreateRegionInput }>, reply: FastifyReply) {
    const region = await this.regionService.createRegion(request.body);
    return reply.status(201).send({ success: true, data: region });
  }

  async updateRegion(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateRegionInput }>,
    reply: FastifyReply,
  ) {
    const region = await this.regionService.updateRegion(request.params.id, request.body);
    return reply.send({ success: true, data: region });
  }

  async deleteRegion(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.regionService.deleteRegion(request.params.id);
    return reply.send({ success: true, message: 'Region deleted' });
  }
}

import { FastifyReply, FastifyRequest } from 'fastify';
import { OpticalHistoryService } from './optical-history.service';
import { opticalHistorySchemas, OpticalHistorySearchQuery } from './optical-history.schema';
import { z } from 'zod';

export class OpticalHistoryController {
  constructor(private opticalHistoryService: OpticalHistoryService) {}

  async searchOpticalHistory(
    request: FastifyRequest<{ Querystring: z.infer<typeof opticalHistorySchemas.opticalHistorySearchQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const { onuId, startDate, endDate, limit, offset } = request.query;

    const history = await this.opticalHistoryService.searchOpticalHistory({
      onuId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    });
    return reply.send({ success: true, data: history });
  }
}

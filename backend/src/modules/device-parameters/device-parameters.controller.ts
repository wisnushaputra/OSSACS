import { FastifyReply, FastifyRequest } from 'fastify';
import { DeviceParameterService } from './device-parameters.service';
import { deviceParameterSchemas } from './device-parameters.schema';
import { z } from 'zod';

export class DeviceParameterController {
  constructor(private deviceParameterService: DeviceParameterService) {}

  async getLatestDeviceParameters(
    request: FastifyRequest<{ Params: { onuId: string } }>,
    reply: FastifyReply,
  ) {
    const { onuId } = request.params;
    const parameters = await this.deviceParameterService.getLatestParameters(onuId);
    return reply.send({ success: true, data: parameters });
  }

  async getDeviceParameterHistory(
    request: FastifyRequest<{
      Params: { onuId: string };
      Querystring: z.infer<typeof deviceParameterSchemas.deviceParameterHistoryQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { onuId } = request.params;
    const { limit, offset, startDate, endDate } = request.query;

    const history = await this.deviceParameterService.getParameterHistory(onuId, {
      limit,
      offset,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
    return reply.send({ success: true, data: history });
  }
}

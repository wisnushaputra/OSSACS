import { FastifyReply, FastifyRequest } from 'fastify';
import { DeviceStatusService } from './device-status.service';
import { deviceStatusSchemas } from './device-status.schema';
import { z } from 'zod';

export class DeviceStatusController {
  constructor(private deviceStatusService: DeviceStatusService) {}

  async listLatestDeviceStatuses(
    request: FastifyRequest<{ Querystring: z.infer<typeof deviceStatusSchemas.paginationQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const { limit, offset } = request.query;
    const statuses = await this.deviceStatusService.listLatestStatuses({ limit, offset });
    return reply.send({ success: true, data: statuses });
  }

  async getDeviceStatus(
    request: FastifyRequest<{ Params: { deviceId: string } }>,
    reply: FastifyReply,
  ) {
    const { deviceId } = request.params;
    const status = await this.deviceStatusService.getLatestStatus(deviceId);
    return reply.send({ success: true, data: status });
  }
}

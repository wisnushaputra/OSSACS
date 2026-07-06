import { FastifyInstance } from 'fastify';
import { DeviceStatusController } from './device-status.controller';
import { DeviceStatusRepository } from './device-status.repository';
import { DeviceStatusService } from './device-status.service';
import { deviceStatusSchemas } from './device-status.schema';
import { z } from 'zod';

export async function deviceStatusRoutes(server: FastifyInstance) {
  const deviceStatusRepository = new DeviceStatusRepository();
  const deviceStatusService = new DeviceStatusService(deviceStatusRepository);
  const deviceStatusController = new DeviceStatusController(deviceStatusService);

  server.get<{
    Querystring: z.infer<typeof deviceStatusSchemas.paginationQuerySchema>;
    Reply: typeof deviceStatusSchemas.deviceStatusesPaginatedApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['device_status:read'])],
      schema: {
        querystring: deviceStatusSchemas.paginationQuerySchema,
        response: { 200: deviceStatusSchemas.deviceStatusesPaginatedApiResponseSchema },
      },
    },
    deviceStatusController.listLatestDeviceStatuses.bind(deviceStatusController),
  );

  server.get<{
    Params: { deviceId: string };
    Reply: typeof deviceStatusSchemas.deviceStatusApiResponseSchema;
  }>(
    '/:deviceId',
    {
      preHandler: [server.authenticate, server.authorize(['device_status:read'])],
      schema: {
        params: z.object({ deviceId: z.string().uuid() }),
        response: { 200: deviceStatusSchemas.deviceStatusApiResponseSchema },
      },
    },
    deviceStatusController.getDeviceStatus.bind(deviceStatusController),
  );
}

import { FastifyInstance } from 'fastify';
import { DeviceParameterController } from './device-parameters.controller';
import { DeviceParameterRepository } from './device-parameters.repository';
import { DeviceParameterService } from './device-parameters.service';
import { deviceParameterSchemas } from './device-parameters.schema';
import { z } from 'zod';

export async function deviceParameterRoutes(server: FastifyInstance) {
  const deviceParameterRepository = new DeviceParameterRepository();
  const deviceParameterService = new DeviceParameterService(deviceParameterRepository);
  const deviceParameterController = new DeviceParameterController(deviceParameterService);

  server.get<{
    Params: { onuId: string };
    Reply: typeof deviceParameterSchemas.deviceParameterApiResponseSchema;
  }>(
    '/:onuId/latest',
    {
      preHandler: [server.authenticate, server.authorize(['device_parameter:read'])],
      schema: {
        params: z.object({ onuId: z.string().uuid() }),
        response: { 200: deviceParameterSchemas.deviceParameterApiResponseSchema },
      },
    },
    deviceParameterController.getLatestDeviceParameters.bind(deviceParameterController),
  );

  server.get<{
    Params: { onuId: string };
    Querystring: z.infer<typeof deviceParameterSchemas.deviceParameterHistoryQuerySchema>;
    Reply: typeof deviceParameterSchemas.deviceParametersPaginatedApiResponseSchema;
  }>(
    '/:onuId/history',
    {
      preHandler: [server.authenticate, server.authorize(['device_parameter:read'])],
      schema: {
        params: z.object({ onuId: z.string().uuid() }),
        querystring: deviceParameterSchemas.deviceParameterHistoryQuerySchema,
        response: { 200: deviceParameterSchemas.deviceParametersPaginatedApiResponseSchema },
      },
    },
    deviceParameterController.getDeviceParameterHistory.bind(deviceParameterController),
  );
}

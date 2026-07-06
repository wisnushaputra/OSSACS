import { FastifyInstance } from 'fastify';
import { AlarmController } from './alarms.controller';
import { AlarmRepository } from './alarms.repository';
import { AlarmService } from './alarms.service';
import { alarmSchemas, CreateAlarmInput, UpdateAlarmInput } from './alarms.schema';
import { z } from 'zod';

const idParamsSchema = z.object({ id: z.string().uuid() });
const deleteAlarmResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export async function alarmRoutes(server: FastifyInstance) {
  const alarmRepository = new AlarmRepository();
  const alarmService = new AlarmService(alarmRepository);
  const alarmController = new AlarmController(alarmService);

  // Search Alarms (GET /api/v1/alarms)
  server.get<{
    Querystring: z.infer<typeof alarmSchemas.alarmSearchQuerySchema>;
    Reply: typeof alarmSchemas.alarmsPaginatedApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['alarm:read'])],
      schema: {
        querystring: alarmSchemas.alarmSearchQuerySchema,
        response: { 200: alarmSchemas.alarmsPaginatedApiResponseSchema },
      },
    },
    alarmController.searchAlarms.bind(alarmController),
  );

  // Get Alarm by ID (GET /api/v1/alarms/:id)
  server.get<{
    Params: z.infer<typeof idParamsSchema>;
    Reply: typeof alarmSchemas.alarmApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['alarm:read'])],
      schema: {
        params: idParamsSchema,
        response: { 200: alarmSchemas.alarmApiResponseSchema },
      },
    },
    alarmController.getAlarm.bind(alarmController),
  );

  // Create Alarm (POST /api/v1/alarms)
  server.post<{
    Body: CreateAlarmInput;
    Reply: typeof alarmSchemas.alarmApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['alarm:create'])],
      schema: {
        body: alarmSchemas.createAlarmSchema,
        response: { 201: alarmSchemas.alarmApiResponseSchema },
      },
    },
    alarmController.createAlarm.bind(alarmController),
  );

  // Update Alarm (PUT /api/v1/alarms/:id)
  server.put<{
    Params: z.infer<typeof idParamsSchema>;
    Body: UpdateAlarmInput;
    Reply: typeof alarmSchemas.alarmApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['alarm:update'])],
      schema: {
        params: idParamsSchema,
        body: alarmSchemas.updateAlarmSchema,
        response: { 200: alarmSchemas.alarmApiResponseSchema },
      },
    },
    alarmController.updateAlarm.bind(alarmController),
  );

  // Delete Alarm (DELETE /api/v1/alarms/:id)
  server.delete<{
    Params: z.infer<typeof idParamsSchema>;
    Reply: typeof deleteAlarmResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['alarm:delete'])],
      schema: {
        params: idParamsSchema,
        response: { 200: deleteAlarmResponseSchema },
      },
    },
    alarmController.deleteAlarm.bind(alarmController),
  );

  // Acknowledge Alarm (POST /api/v1/alarms/:id/acknowledge)
  server.post<{
    Params: z.infer<typeof idParamsSchema>;
    Reply: typeof alarmSchemas.alarmApiResponseSchema;
  }>(
    '/:id/acknowledge',
    {
      preHandler: [server.authenticate, server.authorize(['alarm:update'])],
      schema: {
        params: idParamsSchema,
        response: { 200: alarmSchemas.alarmApiResponseSchema },
      },
    },
    alarmController.acknowledgeAlarm.bind(alarmController),
  );

  // Resolve Alarm (POST /api/v1/alarms/:id/resolve)
  server.post<{
    Params: z.infer<typeof idParamsSchema>;
    Reply: typeof alarmSchemas.alarmApiResponseSchema;
  }>(
    '/:id/resolve',
    {
      preHandler: [server.authenticate, server.authorize(['alarm:update'])],
      schema: {
        params: idParamsSchema,
        response: { 200: alarmSchemas.alarmApiResponseSchema },
      },
    },
    alarmController.resolveAlarm.bind(alarmController),
  );
}

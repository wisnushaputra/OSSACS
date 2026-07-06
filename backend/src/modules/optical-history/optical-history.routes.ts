import { FastifyInstance } from 'fastify';
import { OpticalHistoryController } from './optical-history.controller';
import { OpticalHistoryRepository } from './optical-history.repository';
import { OpticalHistoryService } from './optical-history.service';
import { opticalHistorySchemas } from './optical-history.schema';
import { z } from 'zod';

export async function opticalHistoryRoutes(server: FastifyInstance) {
  const opticalHistoryRepository = new OpticalHistoryRepository();
  const opticalHistoryService = new OpticalHistoryService(opticalHistoryRepository);
  const opticalHistoryController = new OpticalHistoryController(opticalHistoryService);

  // Search Optical History (GET /api/v1/optical-history)
  server.get<{
    Querystring: z.infer<typeof opticalHistorySchemas.opticalHistorySearchQuerySchema>;
    Reply: typeof opticalHistorySchemas.opticalHistoriesPaginatedApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['optical_history:read'])],
      schema: {
        querystring: opticalHistorySchemas.opticalHistorySearchQuerySchema,
        response: { 200: opticalHistorySchemas.opticalHistoriesPaginatedApiResponseSchema },
      },
    },
    opticalHistoryController.searchOpticalHistory.bind(opticalHistoryController),
  );
}

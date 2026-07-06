import { FastifyInstance } from 'fastify';
import { OltController } from './olt.controller';
import { OltRepository } from './olt.repository';
import { OltService } from './olt.service';
import { oltSchemas, CreateOltInput, UpdateOltInput } from './olt.schema';
import { z } from 'zod';

export async function oltRoutes(server: FastifyInstance) {
  const oltRepository = new OltRepository();
  const oltService = new OltService(oltRepository);
  const oltController = new OltController(oltService);

  server.get<{ Querystring: z.infer<typeof oltSchemas.paginationQuerySchema>; Reply: typeof oltSchemas.oltsPaginatedApiResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['olt:read'])],
      schema: {
        querystring: oltSchemas.paginationQuerySchema,
        response: { 200: oltSchemas.oltsPaginatedApiResponseSchema },
      },
    },
    oltController.listOlts.bind(oltController),
  );

  server.post<{ Body: { ipAddress: string; port: string }; Reply: typeof oltSchemas.testConnectionResponseSchema }>(
    '/test-connection',
    {
      preHandler: [server.authenticate, server.authorize(['olt:read'])],
      schema: {
        body: oltSchemas.testConnectionSchema,
        response: { 200: oltSchemas.testConnectionResponseSchema, 400: oltSchemas.testConnectionResponseSchema },
      },
    },
    oltController.testConnection.bind(oltController),
  );

  server.get<{ Params: { id: string }; Reply: typeof oltSchemas.oltApiResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['olt:read'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: oltSchemas.oltApiResponseSchema },
      },
    },
    oltController.getOlt.bind(oltController),
  );

  server.post<{ Body: CreateOltInput; Reply: typeof oltSchemas.oltApiResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['olt:create'])],
      schema: {
        body: oltSchemas.createOltSchema,
        response: { 201: oltSchemas.oltApiResponseSchema },
      },
    },
    oltController.createOlt.bind(oltController),
  );

  server.put<{ Params: { id: string }; Body: UpdateOltInput; Reply: typeof oltSchemas.oltApiResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['olt:update'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: oltSchemas.updateOltSchema,
        response: { 200: oltSchemas.oltApiResponseSchema },
      },
    },
    oltController.updateOlt.bind(oltController),
  );

  server.delete<{ Params: { id: string }; Reply: typeof oltSchemas.deleteOltResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['olt:delete'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: oltSchemas.deleteOltResponseSchema },
      },
    },
    oltController.deleteOlt.bind(oltController),
  );
}
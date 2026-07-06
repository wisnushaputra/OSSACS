import { FastifyInstance } from 'fastify';
import { OnuController } from './onu.controller';
import { OnuRepository } from './onu.repository';
import { OnuService } from './onu.service';
import { onuSchemas, CreateOnuInput, UpdateOnuInput } from './onu.schema';
import { z } from 'zod';

export async function onuRoutes(server: FastifyInstance) {
  const onuRepository = new OnuRepository();
  const onuService = new OnuService(onuRepository);
  const onuController = new OnuController(onuService);

  server.get<{ Querystring: z.infer<typeof onuSchemas.paginationQuerySchema>; Reply: typeof onuSchemas.onusPaginatedApiResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['onu:read'])],
      schema: {
        querystring: onuSchemas.paginationQuerySchema,
        response: { 200: onuSchemas.onusPaginatedApiResponseSchema },
      },
    },
    onuController.listOnus.bind(onuController),
  );

  server.get<{ Querystring: z.infer<typeof onuSchemas.paginationQuerySchema> & { q?: string; customerId?: string; oltId?: string; vendor?: string; status?: string; }; Reply: typeof onuSchemas.onusPaginatedApiResponseSchema }>(
    '/search',
    {
      preHandler: [server.authenticate, server.authorize(['onu:read'])],
      schema: {
        querystring: onuSchemas.paginationQuerySchema.extend({
          q: z.string().optional(),
          customerId: z.string().uuid().optional(),
          oltId: z.string().uuid().optional(),
          vendor: z.string().optional(),
          status: z.string().optional(),
        }),
        response: { 200: onuSchemas.onusPaginatedApiResponseSchema },
      },
    },
    onuController.searchOnus.bind(onuController),
  );

  server.get<{ Params: { id: string }; Reply: typeof onuSchemas.onuApiResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['onu:read'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: onuSchemas.onuApiResponseSchema },
      },
    },
    onuController.getOnu.bind(onuController),
  );

  server.post<{ Body: CreateOnuInput; Reply: typeof onuSchemas.onuApiResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['onu:create'])],
      schema: {
        body: onuSchemas.createOnuSchema,
        response: { 201: onuSchemas.onuApiResponseSchema },
      },
    },
    onuController.createOnu.bind(onuController),
  );

  server.put<{ Params: { id: string }; Body: UpdateOnuInput; Reply: typeof onuSchemas.onuApiResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['onu:update'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: onuSchemas.updateOnuSchema,
        response: { 200: onuSchemas.onuApiResponseSchema },
      },
    },
    onuController.updateOnu.bind(onuController),
  );

  server.delete<{ Params: { id: string }; Reply: typeof onuSchemas.deleteOnuResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['onu:delete'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: onuSchemas.deleteOnuResponseSchema },
      },
    },
    onuController.deleteOnu.bind(onuController),
  );
}
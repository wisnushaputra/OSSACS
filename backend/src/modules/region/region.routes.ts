import { FastifyInstance } from 'fastify';
import { RegionController } from './region.controller';
import { RegionRepository } from './region.repository';
import { RegionService } from './region.service';
import { regionSchemas, CreateRegionInput, UpdateRegionInput } from './schemas';
import { z } from 'zod';

export async function regionRoutes(server: FastifyInstance) {
  const repository = new RegionRepository();
  const service = new RegionService(repository);
  const controller = new RegionController(service);

  server.get<{
    Querystring: { limit?: number; offset?: number };
    Reply: typeof regionSchemas.regionsPaginatedResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['region:read'])],
      schema: {
        querystring: regionSchemas.paginationQuerySchema,
        response: { 200: regionSchemas.regionsPaginatedResponseSchema },
      },
    },
    controller.listRegions.bind(controller),
  );

  server.get<{
    Params: { id: string };
    Reply: typeof regionSchemas.regionApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['region:read'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: regionSchemas.regionApiResponseSchema },
      },
    },
    controller.getRegion.bind(controller),
  );

  server.post<{
    Body: CreateRegionInput;
    Reply: typeof regionSchemas.regionApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['region:create'])],
      schema: {
        body: regionSchemas.createRegionSchema,
        response: { 201: regionSchemas.regionApiResponseSchema },
      },
    },
    controller.createRegion.bind(controller),
  );

  server.put<{
    Params: { id: string };
    Body: UpdateRegionInput;
    Reply: typeof regionSchemas.regionApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['region:update'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: regionSchemas.updateRegionSchema,
        response: { 200: regionSchemas.regionApiResponseSchema },
      },
    },
    controller.updateRegion.bind(controller),
  );

  server.delete<{
    Params: { id: string };
    Reply: typeof regionSchemas.deleteRegionResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['region:delete'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: regionSchemas.deleteRegionResponseSchema },
      },
    },
    controller.deleteRegion.bind(controller),
  );
}
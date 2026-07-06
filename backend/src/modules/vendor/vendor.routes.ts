import { FastifyInstance } from 'fastify';
import { VendorController } from './vendor.controller';
import { VendorRepository } from './vendor.repository';
import { VendorService } from './vendor.service';
import { vendorSchemas, CreateVendorInput, UpdateVendorInput } from './vendor.schema';
import { z } from 'zod';

export async function vendorRoutes(server: FastifyInstance) {
  const vendorRepository = new VendorRepository();
  const vendorService = new VendorService(vendorRepository);
  const vendorController = new VendorController(vendorService);

  server.get<{ Querystring: { limit?: number; offset?: number }; Reply: typeof vendorSchemas.vendorsPaginatedApiResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['vendor:read'])],
      schema: {
        querystring: vendorSchemas.paginationQuerySchema,
        response: { 200: vendorSchemas.vendorsPaginatedApiResponseSchema },
      },
    },
    vendorController.listVendors.bind(vendorController),
  );

  server.get<{ Params: { id: string }; Reply: typeof vendorSchemas.vendorApiResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['vendor:read'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: vendorSchemas.vendorApiResponseSchema },
      },
    },
    vendorController.getVendor.bind(vendorController),
  );

  server.post<{ Body: CreateVendorInput; Reply: typeof vendorSchemas.vendorApiResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['vendor:create'])],
      schema: {
        body: vendorSchemas.createVendorSchema,
        response: { 201: vendorSchemas.vendorApiResponseSchema },
      },
    },
    vendorController.createVendor.bind(vendorController),
  );

  server.put<{ Params: { id: string }; Body: UpdateVendorInput; Reply: typeof vendorSchemas.vendorApiResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['vendor:update'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: vendorSchemas.updateVendorSchema,
        response: { 200: vendorSchemas.vendorApiResponseSchema },
      },
    },
    vendorController.updateVendor.bind(vendorController),
  );

  server.delete<{ Params: { id: string }; Reply: typeof vendorSchemas.deleteVendorResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['vendor:delete'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: vendorSchemas.deleteVendorResponseSchema },
      },
    },
    vendorController.deleteVendor.bind(vendorController),
  );
}
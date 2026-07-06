import { FastifyInstance } from 'fastify';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { profileSchemas, CreateProfileInput, UpdateProfileInput } from './schemas';
import { z } from 'zod';

export async function profileRoutes(server: FastifyInstance) {
  const repository = new ProfileRepository();
  const service = new ProfileService(repository);
  const controller = new ProfileController(service);

  server.get<{
    Querystring: { limit?: number; offset?: number };
    Reply: typeof profileSchemas.profilesPaginatedResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['profile:read'])],
      schema: {
        querystring: profileSchemas.paginationQuerySchema,
        response: { 200: profileSchemas.profilesPaginatedResponseSchema },
      },
    },
    controller.listProfiles.bind(controller),
  );

  server.get<{
    Params: { id: string };
    Reply: typeof profileSchemas.profileApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['profile:read'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: profileSchemas.profileApiResponseSchema },
      },
    },
    controller.getProfile.bind(controller),
  );

  server.post<{
    Body: CreateProfileInput;
    Reply: typeof profileSchemas.profileApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['profile:create'])],
      schema: {
        body: profileSchemas.createProfileSchema,
        response: { 201: profileSchemas.profileApiResponseSchema },
      },
    },
    controller.createProfile.bind(controller),
  );

  server.put<{
    Params: { id: string };
    Body: UpdateProfileInput;
    Reply: typeof profileSchemas.profileApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['profile:update'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: profileSchemas.updateProfileSchema,
        response: { 200: profileSchemas.profileApiResponseSchema },
      },
    },
    controller.updateProfile.bind(controller),
  );

  server.delete<{
    Params: { id: string };
    Reply: typeof profileSchemas.deleteProfileResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['profile:delete'])],
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: { 200: profileSchemas.deleteProfileResponseSchema },
      },
    },
    controller.deleteProfile.bind(controller),
  );
}

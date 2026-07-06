import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { profileSchemas } from './schemas';
import { z } from 'zod';
export async function profileRoutes(server) {
    const repository = new ProfileRepository();
    const service = new ProfileService(repository);
    const controller = new ProfileController(service);
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['profile:read'])],
        schema: {
            querystring: profileSchemas.paginationQuerySchema,
            response: { 200: profileSchemas.profilesPaginatedResponseSchema },
        },
    }, controller.listProfiles.bind(controller));
    server.get('/:id', {
        preHandler: [server.authenticate, server.authorize(['profile:read'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: profileSchemas.profileApiResponseSchema },
        },
    }, controller.getProfile.bind(controller));
    server.post('/', {
        preHandler: [server.authenticate, server.authorize(['profile:create'])],
        schema: {
            body: profileSchemas.createProfileSchema,
            response: { 201: profileSchemas.profileApiResponseSchema },
        },
    }, controller.createProfile.bind(controller));
    server.put('/:id', {
        preHandler: [server.authenticate, server.authorize(['profile:update'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            body: profileSchemas.updateProfileSchema,
            response: { 200: profileSchemas.profileApiResponseSchema },
        },
    }, controller.updateProfile.bind(controller));
    server.delete('/:id', {
        preHandler: [server.authenticate, server.authorize(['profile:delete'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: profileSchemas.deleteProfileResponseSchema },
        },
    }, controller.deleteProfile.bind(controller));
}

import { OltController } from './olt.controller';
import { OltRepository } from './olt.repository';
import { OltService } from './olt.service';
import { oltSchemas } from './olt.schema';
import { z } from 'zod';
export async function oltRoutes(server) {
    const oltRepository = new OltRepository();
    const oltService = new OltService(oltRepository);
    const oltController = new OltController(oltService);
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['olt:read'])],
        schema: {
            querystring: oltSchemas.paginationQuerySchema,
            response: { 200: oltSchemas.oltsPaginatedApiResponseSchema },
        },
    }, oltController.listOlts.bind(oltController));
    server.post('/test-connection', {
        preHandler: [server.authenticate, server.authorize(['olt:read'])],
        schema: {
            body: oltSchemas.testConnectionSchema,
            response: { 200: oltSchemas.testConnectionResponseSchema, 400: oltSchemas.testConnectionResponseSchema },
        },
    }, oltController.testConnection.bind(oltController));
    server.get('/:id', {
        preHandler: [server.authenticate, server.authorize(['olt:read'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: oltSchemas.oltApiResponseSchema },
        },
    }, oltController.getOlt.bind(oltController));
    server.post('/', {
        preHandler: [server.authenticate, server.authorize(['olt:create'])],
        schema: {
            body: oltSchemas.createOltSchema,
            response: { 201: oltSchemas.oltApiResponseSchema },
        },
    }, oltController.createOlt.bind(oltController));
    server.put('/:id', {
        preHandler: [server.authenticate, server.authorize(['olt:update'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            body: oltSchemas.updateOltSchema,
            response: { 200: oltSchemas.oltApiResponseSchema },
        },
    }, oltController.updateOlt.bind(oltController));
    server.delete('/:id', {
        preHandler: [server.authenticate, server.authorize(['olt:delete'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: oltSchemas.deleteOltResponseSchema },
        },
    }, oltController.deleteOlt.bind(oltController));
}

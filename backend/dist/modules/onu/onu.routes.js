import { OnuController } from './onu.controller';
import { OnuRepository } from './onu.repository';
import { OnuService } from './onu.service';
import { onuSchemas } from './onu.schema';
import { z } from 'zod';
export async function onuRoutes(server) {
    const onuRepository = new OnuRepository();
    const onuService = new OnuService(onuRepository);
    const onuController = new OnuController(onuService);
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['onu:read'])],
        schema: {
            querystring: onuSchemas.paginationQuerySchema,
            response: { 200: onuSchemas.onusPaginatedApiResponseSchema },
        },
    }, onuController.listOnus.bind(onuController));
    server.get('/search', {
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
    }, onuController.searchOnus.bind(onuController));
    server.get('/:id', {
        preHandler: [server.authenticate, server.authorize(['onu:read'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: onuSchemas.onuApiResponseSchema },
        },
    }, onuController.getOnu.bind(onuController));
    server.post('/', {
        preHandler: [server.authenticate, server.authorize(['onu:create'])],
        schema: {
            body: onuSchemas.createOnuSchema,
            response: { 201: onuSchemas.onuApiResponseSchema },
        },
    }, onuController.createOnu.bind(onuController));
    server.put('/:id', {
        preHandler: [server.authenticate, server.authorize(['onu:update'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            body: onuSchemas.updateOnuSchema,
            response: { 200: onuSchemas.onuApiResponseSchema },
        },
    }, onuController.updateOnu.bind(onuController));
    server.delete('/:id', {
        preHandler: [server.authenticate, server.authorize(['onu:delete'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: onuSchemas.deleteOnuResponseSchema },
        },
    }, onuController.deleteOnu.bind(onuController));
}

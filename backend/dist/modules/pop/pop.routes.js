import { PopController } from './pop.controller';
import { PopRepository } from './pop.repository';
import { PopService } from './pop.service';
import { popSchemas } from './schemas';
import { z } from 'zod';
export async function popRoutes(server) {
    const repository = new PopRepository();
    const service = new PopService(repository);
    const controller = new PopController(service);
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['pop:read'])],
        schema: {
            querystring: popSchemas.paginationQuerySchema,
            response: { 200: popSchemas.popsPaginatedResponseSchema },
        },
    }, controller.listPops.bind(controller));
    server.get('/:id', {
        preHandler: [server.authenticate, server.authorize(['pop:read'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: popSchemas.popApiResponseSchema },
        },
    }, controller.getPop.bind(controller));
    server.post('/', {
        preHandler: [server.authenticate, server.authorize(['pop:create'])],
        schema: {
            body: popSchemas.createPopSchema,
            response: { 201: popSchemas.popApiResponseSchema },
        },
    }, controller.createPop.bind(controller));
    server.put('/:id', {
        preHandler: [server.authenticate, server.authorize(['pop:update'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            body: popSchemas.updatePopSchema,
            response: { 200: popSchemas.popApiResponseSchema },
        },
    }, controller.updatePop.bind(controller));
    server.delete('/:id', {
        preHandler: [server.authenticate, server.authorize(['pop:delete'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: popSchemas.deletePopResponseSchema },
        },
    }, controller.deletePop.bind(controller));
}

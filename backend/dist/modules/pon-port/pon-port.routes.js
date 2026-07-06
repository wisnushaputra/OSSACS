import { PonPortController } from './pon-port.controller';
import { PonPortRepository } from './pon-port.repository';
import { PonPortService } from './pon-port.service';
import { ponPortSchemas } from './pon-port.schema';
import { z } from 'zod';
export async function ponPortRoutes(server) {
    const ponPortRepository = new PonPortRepository();
    const ponPortService = new PonPortService(ponPortRepository);
    const ponPortController = new PonPortController(ponPortService);
    server.get('/olt/:oltId', {
        preHandler: [server.authenticate, server.authorize(['olt:read'])],
        schema: {
            params: z.object({ oltId: z.string().uuid() }),
            querystring: ponPortSchemas.paginationQuerySchema,
            response: { 200: ponPortSchemas.ponPortsPaginatedApiResponseSchema },
        },
    }, ponPortController.listPonPorts.bind(ponPortController));
    server.get('/:id', {
        preHandler: [server.authenticate, server.authorize(['olt:read'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            response: { 200: ponPortSchemas.ponPortApiResponseSchema },
        },
    }, ponPortController.getPonPort.bind(ponPortController));
    server.put('/:id', {
        preHandler: [server.authenticate, server.authorize(['olt:update'])],
        schema: {
            params: z.object({ id: z.string().uuid() }),
            body: ponPortSchemas.updatePonPortSchema,
            response: { 200: ponPortSchemas.ponPortApiResponseSchema },
        },
    }, ponPortController.updatePonPort.bind(ponPortController));
}

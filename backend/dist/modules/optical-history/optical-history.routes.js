import { OpticalHistoryController } from './optical-history.controller';
import { OpticalHistoryRepository } from './optical-history.repository';
import { OpticalHistoryService } from './optical-history.service';
import { opticalHistorySchemas } from './optical-history.schema';
export async function opticalHistoryRoutes(server) {
    const opticalHistoryRepository = new OpticalHistoryRepository();
    const opticalHistoryService = new OpticalHistoryService(opticalHistoryRepository);
    const opticalHistoryController = new OpticalHistoryController(opticalHistoryService);
    // Search Optical History (GET /api/v1/optical-history)
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['optical_history:read'])],
        schema: {
            querystring: opticalHistorySchemas.opticalHistorySearchQuerySchema,
            response: { 200: opticalHistorySchemas.opticalHistoriesPaginatedApiResponseSchema },
        },
    }, opticalHistoryController.searchOpticalHistory.bind(opticalHistoryController));
}

import { NotificationController } from './notifications.controller';
import { NotificationRepository } from './notifications.repository';
import { NotificationService } from './notifications.service';
import { notificationSchemas } from './notifications.schema';
import { z } from 'zod';
const idParamsSchema = z.object({ id: z.string().uuid() });
export async function notificationRoutes(server) {
    const notificationRepository = new NotificationRepository();
    const notificationService = new NotificationService(notificationRepository);
    const notificationController = new NotificationController(notificationService);
    // Search Notifications (GET /api/v1/notifications)
    server.get('/', {
        preHandler: [server.authenticate, server.authorize(['notification:read'])],
        schema: {
            querystring: notificationSchemas.notificationSearchQuerySchema,
            response: { 200: notificationSchemas.notificationsPaginatedApiResponseSchema },
        },
    }, notificationController.searchNotifications.bind(notificationController));
    // Get Notification by ID (GET /api/v1/notifications/:id)
    server.get('/:id', {
        preHandler: [server.authenticate, server.authorize(['notification:read'])],
        schema: {
            params: idParamsSchema,
            response: { 200: notificationSchemas.notificationApiResponseSchema },
        },
    }, notificationController.getNotification.bind(notificationController));
    // Mark as Read (PATCH /api/v1/notifications/:id/read)
    server.patch('/:id/read', {
        preHandler: [server.authenticate, server.authorize(['notification:update'])],
        schema: {
            params: idParamsSchema,
            response: { 200: notificationSchemas.markAsReadResponseSchema },
        },
    }, notificationController.markAsRead.bind(notificationController));
    // Mark as Unread (PATCH /api/v1/notifications/:id/unread)
    server.patch('/:id/unread', {
        preHandler: [server.authenticate, server.authorize(['notification:update'])],
        schema: {
            params: idParamsSchema,
            response: { 200: notificationSchemas.markAsReadResponseSchema },
        },
    }, notificationController.markAsUnread.bind(notificationController));
}

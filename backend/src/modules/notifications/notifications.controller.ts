import { FastifyReply, FastifyRequest } from 'fastify';
import { NotificationService } from './notifications.service';
import { notificationSchemas, NotificationSearchQuery } from './notifications.schema';
import { z } from 'zod';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  async searchNotifications(
    request: FastifyRequest<{ Querystring: z.infer<typeof notificationSchemas.notificationSearchQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const notifications = await this.notificationService.searchNotifications(request.query);
    return reply.send({ success: true, data: notifications });
  }

  async getNotification(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const notification = await this.notificationService.getNotification(request.params.id);
    return reply.send({ success: true, data: notification });
  }

  async markAsRead(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const notification = await this.notificationService.markAsRead(request.params.id);
    return reply.send({ success: true, data: notification });
  }

  async markAsUnread(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const notification = await this.notificationService.markAsUnread(request.params.id);
    return reply.send({ success: true, data: notification });
  }
}

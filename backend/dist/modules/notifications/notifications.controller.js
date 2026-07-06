export class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async searchNotifications(request, reply) {
        const notifications = await this.notificationService.searchNotifications(request.query);
        return reply.send({ success: true, data: notifications });
    }
    async getNotification(request, reply) {
        const notification = await this.notificationService.getNotification(request.params.id);
        return reply.send({ success: true, data: notification });
    }
    async markAsRead(request, reply) {
        const notification = await this.notificationService.markAsRead(request.params.id);
        return reply.send({ success: true, data: notification });
    }
    async markAsUnread(request, reply) {
        const notification = await this.notificationService.markAsUnread(request.params.id);
        return reply.send({ success: true, data: notification });
    }
}

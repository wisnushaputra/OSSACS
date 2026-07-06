import { NotFoundError } from '../../lib/errors';
export class NotificationService {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async getNotification(id) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new NotFoundError('Notification');
        }
        return notification;
    }
    async searchNotifications(params) {
        return this.notificationRepository.search(params);
    }
    async markAsRead(id) {
        const notification = await this.notificationRepository.update(id, { isRead: true });
        if (!notification) {
            throw new NotFoundError('Notification');
        }
        return notification;
    }
    async markAsUnread(id) {
        const notification = await this.notificationRepository.update(id, { isRead: false });
        if (!notification) {
            throw new NotFoundError('Notification');
        }
        return notification;
    }
}

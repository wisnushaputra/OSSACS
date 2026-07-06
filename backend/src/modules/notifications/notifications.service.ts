import { NotificationRepository } from './notifications.repository';
import { NotificationSearchQuery } from './notifications.schema';
import { NotFoundError } from '../../lib/errors';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getNotification(id: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification');
    }
    return notification;
  }

  async searchNotifications(params: NotificationSearchQuery) {
    return this.notificationRepository.search(params);
  }

  async markAsRead(id: string) {
    const notification = await this.notificationRepository.update(id, { isRead: true });
    if (!notification) {
      throw new NotFoundError('Notification');
    }
    return notification;
  }

  async markAsUnread(id: string) {
    const notification = await this.notificationRepository.update(id, { isRead: false });
    if (!notification) {
      throw new NotFoundError('Notification');
    }
    return notification;
  }
}

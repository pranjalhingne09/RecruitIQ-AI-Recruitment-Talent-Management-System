import api from './api';

export const notificationService = {
  getNotifications: (unreadOnly = false) =>
    api.get(`/notifications?unreadOnly=${unreadOnly}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
};

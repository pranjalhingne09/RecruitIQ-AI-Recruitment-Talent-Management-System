import { Notification } from '../models/Notification.js';

export const createNotification = async ({
  recipientId,
  title,
  message,
  type = 'system',
  link = '',
}) => {
  try {
    return await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      link,
    });
  } catch (error) {
    console.error('Failed to create in-app notification:', error.message);
    return null;
  }
};

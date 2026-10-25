import { AuditLog } from '../models/AuditLog.js';

export const logAudit = async ({
  userId = null,
  action,
  resource,
  resourceId = '',
  details = {},
  req = null,
}) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '') : '';
    const userAgent = req ? req.headers['user-agent'] || '' : '';

    await AuditLog.create({
      user: userId,
      action,
      resource,
      resourceId: String(resourceId),
      details,
      ipAddress: String(ipAddress),
      userAgent: String(userAgent),
    });
  } catch (error) {
    // Non-blocking error for audit logging
    console.error('Audit Log recording failed:', error.message);
  }
};

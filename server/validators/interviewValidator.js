import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const scheduleInterviewValidator = [
  body('applicationId').notEmpty().withMessage('Application ID is required').isMongoId().withMessage('Invalid Application ID'),
  body('scheduledDate').notEmpty().withMessage('Interview date is required').isISO8601().withMessage('Valid date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('type').optional().isIn(['online', 'in-person', 'phone']).withMessage('Invalid interview type'),
  validate,
];

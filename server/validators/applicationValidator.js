import { body } from 'express-validator';
import { validate } from './authValidator.js';
import { APPLICATION_STATUS } from '../models/Application.js';

export const applyJobValidator = [
  body('jobId').notEmpty().withMessage('Job ID is required').isMongoId().withMessage('Invalid Job ID format'),
  body('resumeId').notEmpty().withMessage('Resume ID is required').isMongoId().withMessage('Invalid Resume ID format'),
  body('coverLetter').optional().isLength({ max: 2000 }).withMessage('Cover letter maximum 2000 characters'),
  validate,
];

export const updateApplicationStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(APPLICATION_STATUS))
    .withMessage('Invalid application status'),
  body('note').optional().trim(),
  body('rejectionReason').optional().trim(),
  validate,
];

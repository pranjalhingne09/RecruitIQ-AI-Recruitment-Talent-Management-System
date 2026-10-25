import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const jobCreateValidator = [
  body('title').trim().notEmpty().withMessage('Job title is required').isLength({ max: 120 }).withMessage('Title too long'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('employmentType')
    .optional()
    .isIn(['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'])
    .withMessage('Invalid employment type'),
  body('experienceLevel')
    .optional()
    .isIn(['Entry', 'Mid', 'Senior', 'Lead'])
    .withMessage('Invalid experience level'),
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one required skill is recommended'),
  validate,
];

export const jobUpdateValidator = [
  body('title').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Job description cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  validate,
];

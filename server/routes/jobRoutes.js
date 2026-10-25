import express from 'express';
import {
  getJobs,
  getJobById,
  getRecruiterJobs,
  createJob,
  updateJob,
  toggleJobStatus,
  deleteJob,
} from '../controllers/jobController.js';
import { jobCreateValidator, jobUpdateValidator } from '../validators/jobValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Recruiter routes
router.get('/recruiter/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.post('/', protect, authorize('recruiter', 'admin'), jobCreateValidator, createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), jobUpdateValidator, updateJob);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), toggleJobStatus);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;

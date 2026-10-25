import express from 'express';
import {
  applyToJob,
  getJobApplications,
  getRecruiterAllApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/applicationController.js';
import {
  applyJobValidator,
  updateApplicationStatusValidator,
} from '../validators/applicationValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

// Candidate routes
router.post('/apply', authorize('candidate'), applyJobValidator, applyToJob);
router.post('/:id/withdraw', authorize('candidate'), withdrawApplication);

// Recruiter routes
router.get('/job/:jobId', authorize('recruiter', 'admin'), getJobApplications);
router.get('/recruiter/all', authorize('recruiter', 'admin'), getRecruiterAllApplications);
router.patch('/:id/status', authorize('recruiter', 'admin'), updateApplicationStatusValidator, updateApplicationStatus);

// Shared route (authorized candidate, recruiter of job, admin)
router.get('/:id', getApplicationById);

export default router;

import express from 'express';
import {
  getAdminAnalytics,
  getRecruiterAnalytics,
  getCandidateAnalytics,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminAnalytics);
router.get('/recruiter', authorize('recruiter', 'admin'), getRecruiterAnalytics);
router.get('/candidate', authorize('candidate'), getCandidateAnalytics);

export default router;

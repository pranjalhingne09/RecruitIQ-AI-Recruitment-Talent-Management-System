import express from 'express';
import {
  getJobMatch,
  getRecommendedJobs,
  getAiApplicationInsights,
} from '../controllers/matchingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/job/:jobId', authorize('candidate'), getJobMatch);
router.get('/recommendations', authorize('candidate'), getRecommendedJobs);
router.get('/application/:applicationId/ai-insights', authorize('recruiter', 'admin'), getAiApplicationInsights);

export default router;

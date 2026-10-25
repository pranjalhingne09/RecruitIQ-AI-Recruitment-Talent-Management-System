import express from 'express';
import {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
  updateInterview,
} from '../controllers/interviewController.js';
import { scheduleInterviewValidator } from '../validators/interviewValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('recruiter', 'admin'), scheduleInterviewValidator, scheduleInterview);
router.get('/recruiter', authorize('recruiter', 'admin'), getRecruiterInterviews);
router.get('/candidate', authorize('candidate'), getCandidateInterviews);
router.patch('/:id', authorize('recruiter', 'admin'), updateInterview);

export default router;

import express from 'express';
import {
  getProfile,
  updateProfile,
  getMyApplications,
  getMyInterviews,
} from '../controllers/candidateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('candidate'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/applications', getMyApplications);
router.get('/interviews', getMyInterviews);

export default router;

import express from 'express';
import { getProfile, updateProfile } from '../controllers/recruiterController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;

import express from 'express';
import {
  registerCandidate,
  registerRecruiter,
  login,
  logout,
  getMe,
} from '../controllers/authController.js';
import {
  registerCandidateValidator,
  registerRecruiterValidator,
  loginValidator,
} from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register/candidate', registerCandidateValidator, registerCandidate);
router.post('/register/recruiter', registerRecruiterValidator, registerRecruiter);
router.post('/login', loginValidator, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;

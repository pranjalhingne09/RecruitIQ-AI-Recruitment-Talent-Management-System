import express from 'express';
import { updateUserDetails, updatePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserDetails);
router.put('/password', protect, updatePassword);

export default router;

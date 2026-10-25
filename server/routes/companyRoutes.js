import express from 'express';
import { getCompany, updateCompany } from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/:id?', getCompany);
router.put('/', protect, authorize('recruiter', 'admin'), updateCompany);

export default router;

import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  getAllJobsAdmin,
  deleteJobAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAuditLogs,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Categories get is open / authenticated
router.get('/categories', getCategories);

// Admin-only operations
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);

router.get('/jobs', getAllJobsAdmin);
router.delete('/jobs/:id', deleteJobAdmin);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/audit-logs', getAuditLogs);

export default router;

import express from 'express';
import {
  uploadResume,
  getMyResumes,
  getResumeById,
  downloadResumeFile,
  deleteResume,
} from '../controllers/resumeController.js';
import { resumeUpload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', authorize('candidate'), resumeUpload.single('resume'), uploadResume);
router.get('/my-resumes', authorize('candidate'), getMyResumes);
router.get('/:id', getResumeById);
router.get('/:id/download', downloadResumeFile);
router.delete('/:id', authorize('candidate'), deleteResume);

export default router;

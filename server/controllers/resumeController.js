import fs from 'fs';
import path from 'path';
import { Resume } from '../models/Resume.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { analyzeResumeDocument } from '../services/resumeAnalysisService.js';
import { sendSuccess, sendCreated, sendError } from '../utils/apiResponse.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Upload & Analyze Resume (PDF/DOCX)
// @route   POST /api/resumes/upload
// @access  Private (Candidate)
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please select a resume file (.pdf or .docx) to upload.', 400);
    }

    const { originalname, filename, path: filePath, mimetype, size } = req.file;

    let analysisResult;
    try {
      analysisResult = await analyzeResumeDocument(filePath, mimetype);
    } catch (parseErr) {
      // If parsing fails, remove uploaded file to avoid disk pollution
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return sendError(res, `Failed to parse resume document: ${parseErr.message}`, 422);
    }

    const { extractedText, extractedSkills, metadata } = analysisResult;

    // Create Resume record in MongoDB
    const resume = await Resume.create({
      candidate: req.user.id,
      originalName: originalname,
      fileName: filename,
      filePath: filePath,
      mimeType: mimetype,
      fileSize: size,
      extractedText,
      extractedSkills,
      parseStatus: 'success',
      analysisMetadata: metadata,
    });

    // Update candidate's activeResume and merge skills into profile
    const profile = await CandidateProfile.findOne({ user: req.user.id });
    if (profile) {
      profile.activeResume = resume._id;
      // Merge skills avoiding duplicates
      const mergedSkills = Array.from(new Set([...(profile.skills || []), ...extractedSkills]));
      profile.skills = mergedSkills;
      await profile.save();
    }

    await logAudit({
      userId: req.user.id,
      action: 'RESUME_UPLOADED',
      resource: 'Resume',
      resourceId: resume._id,
      details: { originalName: originalname, skillsFound: extractedSkills.length },
      req,
    });

    return sendCreated(res, 'Resume uploaded and analyzed successfully', {
      resume: {
        id: resume._id,
        originalName: resume.originalName,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        extractedSkills: resume.extractedSkills,
        analysisMetadata: resume.analysisMetadata,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's uploaded resumes
// @route   GET /api/resumes/my-resumes
// @access  Private (Candidate)
export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ candidate: req.user.id })
      .select('-extractedText')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Resumes retrieved', resumes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Resume metadata / analysis by ID
// @route   GET /api/resumes/:id
// @access  Private (Candidate owner, Authorized Recruiter, Admin)
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume not found', 404);
    }

    // Permission Check: Candidate owner, Recruiter reviewing application, or Admin
    const isOwner = resume.candidate.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    let isAuthorizedRecruiter = false;
    if (req.user.role === 'recruiter') {
      const recruiterJobs = await Job.find({ recruiter: req.user.id }).select('_id');
      const jobIds = recruiterJobs.map((j) => j._id);
      const application = await Application.findOne({
        job: { $in: jobIds },
        candidate: resume.candidate,
      });
      if (application) {
        isAuthorizedRecruiter = true;
      }
    }

    if (!isOwner && !isAdmin && !isAuthorizedRecruiter) {
      return sendError(res, 'Access denied. You do not have permission to access this candidate resume.', 403);
    }

    return sendSuccess(res, 'Resume retrieved', resume);
  } catch (error) {
    next(error);
  }
};

// @desc    Download resume file securely
// @route   GET /api/resumes/:id/download
// @access  Private (Candidate owner, Authorized Recruiter, Admin)
export const downloadResumeFile = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume file record not found', 404);
    }

    const isOwner = resume.candidate.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    let isAuthorizedRecruiter = false;
    if (req.user.role === 'recruiter') {
      const recruiterJobs = await Job.find({ recruiter: req.user.id }).select('_id');
      const jobIds = recruiterJobs.map((j) => j._id);
      const application = await Application.findOne({
        job: { $in: jobIds },
        candidate: resume.candidate,
      });
      if (application) {
        isAuthorizedRecruiter = true;
      }
    }

    if (!isOwner && !isAdmin && !isAuthorizedRecruiter) {
      return sendError(res, 'Access denied. You are not authorized to download this resume.', 403);
    }

    if (!fs.existsSync(resume.filePath)) {
      return sendError(res, 'File does not exist on storage server.', 404);
    }

    res.setHeader('Content-Type', resume.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(resume.originalName)}"`);

    const fileStream = fs.createReadStream(resume.filePath);
    return fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Resume
// @route   DELETE /api/resumes/:id
// @access  Private (Candidate)
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, candidate: req.user.id });
    if (!resume) {
      return sendError(res, 'Resume not found or unauthorized to delete.', 404);
    }

    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Resume.findByIdAndDelete(resume._id);

    // If this was activeResume, clear it
    await CandidateProfile.updateOne(
      { user: req.user.id, activeResume: resume._id },
      { $set: { activeResume: null } }
    );

    return sendSuccess(res, 'Resume deleted successfully');
  } catch (error) {
    next(error);
  }
};

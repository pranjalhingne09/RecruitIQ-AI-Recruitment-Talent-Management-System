import { Application, APPLICATION_STATUS } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Resume } from '../models/Resume.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { calculateSkillMatch } from '../services/jobMatchingService.js';
import { createNotification } from '../services/notificationService.js';
import { sendSuccess, sendCreated, sendError } from '../utils/apiResponse.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Apply for a Job Vacancy
// @route   POST /api/applications/apply
// @access  Private (Candidate)
export const applyToJob = async (req, res, next) => {
  try {
    const { jobId, resumeId, coverLetter } = req.body;

    // 1. Verify Job exists and is active
    const job = await Job.findOne({ _id: jobId, isDeleted: false });
    if (!job) {
      return sendError(res, 'Job vacancy not found.', 404);
    }
    if (job.status !== 'active') {
      return sendError(res, 'This job vacancy is currently closed for applications.', 400);
    }

    // 2. Prevent duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });
    if (existingApplication) {
      return sendError(
        res,
        'Duplicate Application: You have already applied for this job vacancy.',
        409
      );
    }

    // 3. Verify Resume belongs to the candidate
    const resume = await Resume.findOne({ _id: resumeId, candidate: req.user.id });
    if (!resume) {
      return sendError(res, 'Specified resume was not found or does not belong to your account.', 400);
    }

    // 4. Gather Candidate Skills (from Resume + CandidateProfile)
    const profile = await CandidateProfile.findOne({ user: req.user.id });
    const profileSkills = profile?.skills || [];
    const resumeSkills = resume.extractedSkills || [];
    const combinedCandidateSkills = Array.from(new Set([...profileSkills, ...resumeSkills]));

    // 5. Calculate Explainable Match Score
    const matchAnalysis = calculateSkillMatch(
      combinedCandidateSkills,
      job.requiredSkills || [],
      job.niceToHaveSkills || []
    );

    // 6. Create Application
    const application = await Application.create({
      job: job._id,
      candidate: req.user.id,
      resume: resume._id,
      status: APPLICATION_STATUS.APPLIED,
      coverLetter: coverLetter || '',
      matchScore: matchAnalysis.matchScore,
      matchedSkills: matchAnalysis.matchedSkills,
      missingSkills: matchAnalysis.missingSkills,
      scoreBreakdown: matchAnalysis.scoreBreakdown,
      statusHistory: [
        {
          status: APPLICATION_STATUS.APPLIED,
          updatedBy: req.user.id,
          note: 'Application submitted by candidate.',
          timestamp: new Date(),
        },
      ],
    });

    // 7. Increment applicantsCount on Job
    await Job.findByIdAndUpdate(job._id, { $inc: { applicantsCount: 1 } });

    // 8. In-App Notification to Recruiter
    await createNotification({
      recipientId: job.recruiter,
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${job.title}" with a skill match score of ${matchAnalysis.matchScore}%.`,
      type: 'application_status',
      link: `/recruiter/applications?jobId=${job._id}`,
    });

    // 9. Audit Log
    await logAudit({
      userId: req.user.id,
      action: 'APPLICATION_SUBMITTED',
      resource: 'Application',
      resourceId: application._id,
      details: { jobId: job._id, matchScore: matchAnalysis.matchScore },
      req,
    });

    return sendCreated(res, 'Application submitted successfully', application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job (Recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
export const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, search, sortBy = 'matchScore', sortOrder = 'desc' } = req.query;

    const job = await Job.findOne({ _id: jobId, isDeleted: false });
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized to view applicants for this job.', 403);
    }

    const query = { job: jobId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const sortOption = {};
    if (sortBy === 'matchScore') {
      sortOption.matchScore = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    let applications = await Application.find(query)
      .populate('candidate', 'name email phone avatar')
      .populate('resume', 'originalName fileName filePath extractedSkills analysisMetadata createdAt')
      .sort(sortOption);

    // Search filter candidate name or email in memory if search query provided
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter((app) => {
        const name = app.candidate?.name?.toLowerCase() || '';
        const email = app.candidate?.email?.toLowerCase() || '';
        return name.includes(searchLower) || email.includes(searchLower);
      });
    }

    return sendSuccess(res, 'Applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across all jobs for the recruiter
// @route   GET /api/applications/recruiter/all
// @access  Private (Recruiter)
export const getRecruiterAllApplications = async (req, res, next) => {
  try {
    const recruiterJobs = await Job.find({ recruiter: req.user.id, isDeleted: false }).select('_id');
    const jobIds = recruiterJobs.map((j) => j._id);

    const { status, jobId } = req.query;
    const query = { job: { $in: jobIds } };

    if (status && status !== 'all') {
      query.status = status;
    }
    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('job', 'title location employmentType status')
      .populate('candidate', 'name email phone avatar')
      .populate('resume', 'originalName fileName filePath extractedSkills')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Recruiter applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private (Candidate owner, Job recruiter, Admin)
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        populate: [{ path: 'company' }, { path: 'recruiter', select: 'name email avatar' }],
      })
      .populate('candidate', 'name email phone avatar')
      .populate('resume')
      .populate('statusHistory.updatedBy', 'name role');

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    const isApplicant = application.candidate._id.toString() === req.user.id;
    const isJobRecruiter = application.job.recruiter._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isApplicant && !isJobRecruiter && !isAdmin) {
      return sendError(res, 'Unauthorized access to this application record.', 403);
    }

    // Get candidate profile details for the recruiter
    let candidateProfile = null;
    if (isJobRecruiter || isAdmin) {
      candidateProfile = await CandidateProfile.findOne({ user: application.candidate._id });
    }

    return sendSuccess(res, 'Application details retrieved', {
      application,
      candidateProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Application Status (Recruiter Stage Transitions)
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note, rejectionReason, recruiterNotes } = req.body;

    const application = await Application.findById(req.params.id).populate('job candidate');
    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    // Recruiter authorization check
    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized. You can only update applications for your own job postings.', 403);
    }

    const previousStatus = application.status;
    application.status = status;

    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }

    if (rejectionReason !== undefined) {
      application.rejectionReason = rejectionReason;
    }

    application.statusHistory.push({
      status,
      updatedBy: req.user.id,
      note: note || `Status transitioned from ${previousStatus} to ${status}.`,
      timestamp: new Date(),
    });

    await application.save();

    // In-app Notification to Candidate
    await createNotification({
      recipientId: application.candidate._id,
      title: 'Application Status Update',
      message: `Your application for "${application.job.title}" has been updated to: ${status.replace('_', ' ')}.`,
      type: 'application_status',
      link: `/candidate/applications/${application._id}`,
    });

    await logAudit({
      userId: req.user.id,
      action: 'APPLICATION_STATUS_UPDATED',
      resource: 'Application',
      resourceId: application._id,
      details: { from: previousStatus, to: status, note },
      req,
    });

    return sendSuccess(res, `Application status updated to ${status}`, application);
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw Application (Candidate)
// @route   POST /api/applications/:id/withdraw
// @access  Private (Candidate)
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    if (application.candidate.toString() !== req.user.id) {
      return sendError(res, 'Unauthorized. You can only withdraw your own applications.', 403);
    }

    if ([APPLICATION_STATUS.HIRED, APPLICATION_STATUS.REJECTED].includes(application.status)) {
      return sendError(res, `Cannot withdraw an application that is already ${application.status}.`, 400);
    }

    application.status = APPLICATION_STATUS.WITHDRAWN;
    application.statusHistory.push({
      status: APPLICATION_STATUS.WITHDRAWN,
      updatedBy: req.user.id,
      note: 'Candidate withdrew application.',
      timestamp: new Date(),
    });

    await application.save();

    // Decrement applicantsCount
    await Job.findByIdAndUpdate(application.job._id, { $inc: { applicantsCount: -1 } });

    return sendSuccess(res, 'Application withdrawn successfully', application);
  } catch (error) {
    next(error);
  }
};

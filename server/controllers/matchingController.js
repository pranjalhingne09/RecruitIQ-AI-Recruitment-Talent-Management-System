import { Job } from '../models/Job.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { Resume } from '../models/Resume.js';
import { Application } from '../models/Application.js';
import { calculateSkillMatch, rankJobsForCandidate } from '../services/jobMatchingService.js';
import { generateResumeInsights } from '../services/aiService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Calculate explainable match for candidate against a job
// @route   GET /api/matching/job/:jobId
// @access  Private (Candidate)
export const getJobMatch = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, isDeleted: false });

    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate('activeResume');
    const profileSkills = profile?.skills || [];
    const resumeSkills = profile?.activeResume?.extractedSkills || [];
    const combinedCandidateSkills = Array.from(new Set([...profileSkills, ...resumeSkills]));

    const matchAnalysis = calculateSkillMatch(
      combinedCandidateSkills,
      job.requiredSkills || [],
      job.niceToHaveSkills || []
    );

    return sendSuccess(res, 'Job match calculated', {
      job: {
        id: job._id,
        title: job.title,
        requiredSkills: job.requiredSkills,
        niceToHaveSkills: job.niceToHaveSkills,
      },
      candidateSkills: combinedCandidateSkills,
      ...matchAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended jobs for candidate based on skills
// @route   GET /api/matching/recommendations
// @access  Private (Candidate)
export const getRecommendedJobs = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate('activeResume');
    const profileSkills = profile?.skills || [];
    const resumeSkills = profile?.activeResume?.extractedSkills || [];
    const candidateSkills = Array.from(new Set([...profileSkills, ...resumeSkills]));

    // Fetch active non-deleted jobs
    const activeJobs = await Job.find({ status: 'active', isDeleted: false })
      .populate('company', 'name logo location industry')
      .populate('category', 'name icon');

    // Rank jobs using transparent matching algorithm
    const ranked = rankJobsForCandidate(activeJobs, candidateSkills);

    // Filter to top recommendations (e.g., top 12)
    const recommendations = ranked.slice(0, 12);

    return sendSuccess(res, 'Job recommendations retrieved', {
      candidateSkillsCount: candidateSkills.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI screening insights for an application (Recruiter)
// @route   GET /api/matching/application/:applicationId/ai-insights
// @access  Private (Recruiter)
export const getAiApplicationInsights = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('job', 'title requiredSkills niceToHaveSkills recruiter')
      .populate('resume', 'extractedText extractedSkills originalName');

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized to view insights for this candidate application.', 403);
    }

    const resumeText = application.resume?.extractedText || '';
    const extractedSkills = application.resume?.extractedSkills || application.matchedSkills || [];
    const jobRequirements = application.job?.requiredSkills || [];

    const insights = await generateResumeInsights({
      resumeText,
      extractedSkills,
      jobRequirements,
    });

    return sendSuccess(res, 'AI screening insights generated', insights);
  } catch (error) {
    next(error);
  }
};

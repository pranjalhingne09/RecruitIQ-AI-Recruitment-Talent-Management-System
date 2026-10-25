import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application, APPLICATION_STATUS } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { AuditLog } from '../models/AuditLog.js';
import { sendSuccess } from '../utils/apiResponse.js';

// @desc    Admin Platform Dashboard Analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      totalInterviews,
      statusCounts,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments({ isDeleted: false }),
      Job.countDocuments({ status: 'active', isDeleted: false }),
      Application.countDocuments(),
      Interview.countDocuments(),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      AuditLog.find()
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

    // Format pipeline funnel
    const statusMap = {};
    Object.values(APPLICATION_STATUS).forEach((st) => (statusMap[st] = 0));
    statusCounts.forEach((item) => {
      if (item._id) statusMap[item._id] = item.count;
    });

    const pipelineFunnel = [
      { name: 'Applied', count: statusMap.APPLIED || 0, fill: '#6366f1' },
      { name: 'Under Review', count: statusMap.UNDER_REVIEW || 0, fill: '#8b5cf6' },
      { name: 'Shortlisted', count: statusMap.SHORTLISTED || 0, fill: '#06b6d4' },
      { name: 'Interviewed', count: statusMap.INTERVIEW_SCHEDULED || 0, fill: '#3b82f6' },
      { name: 'Offered', count: statusMap.OFFERED || 0, fill: '#10b981' },
      { name: 'Hired', count: statusMap.HIRED || 0, fill: '#059669' },
      { name: 'Rejected', count: statusMap.REJECTED || 0, fill: '#ef4444' },
    ];

    // Monthly Application Trends (Aggregated by month)
    const monthlyAppTrends = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          applications: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
    ]);

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrends = monthlyAppTrends.map((t) => ({
      name: `${monthNames[t._id.month]} ${t._id.year}`,
      applications: t.applications,
    }));

    return sendSuccess(res, 'Admin analytics generated', {
      metrics: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        totalInterviews,
      },
      pipelineFunnel,
      monthlyTrends: formattedTrends.length > 0 ? formattedTrends : [{ name: 'Current Month', applications: totalApplications }],
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recruiter Dashboard Analytics
// @route   GET /api/analytics/recruiter
// @access  Private (Recruiter)
export const getRecruiterAnalytics = async (req, res, next) => {
  try {
    const recruiterJobs = await Job.find({ recruiter: req.user.id, isDeleted: false });
    const jobIds = recruiterJobs.map((j) => j._id);

    const [
      totalApplications,
      statusCounts,
      upcomingInterviews,
      recentApplicants,
    ] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Interview.find({
        recruiter: req.user.id,
        scheduledDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: 'scheduled',
      })
        .populate('job', 'title')
        .populate('candidate', 'name email avatar')
        .sort({ scheduledDate: 1 })
        .limit(5),
      Application.find({ job: { $in: jobIds } })
        .populate('job', 'title')
        .populate('candidate', 'name email avatar phone')
        .populate('resume', 'extractedSkills')
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const statusMap = {};
    Object.values(APPLICATION_STATUS).forEach((st) => (statusMap[st] = 0));
    statusCounts.forEach((item) => {
      if (item._id) statusMap[item._id] = item.count;
    });

    const activeJobs = recruiterJobs.filter((j) => j.status === 'active').length;

    // Applications per job distribution
    const jobDistribution = recruiterJobs.map((job) => ({
      name: job.title.length > 20 ? `${job.title.substring(0, 18)}...` : job.title,
      applicants: job.applicantsCount || 0,
    }));

    return sendSuccess(res, 'Recruiter analytics generated', {
      metrics: {
        totalJobs: recruiterJobs.length,
        activeJobs,
        totalApplications,
        awaitingReview: statusMap.APPLIED + statusMap.UNDER_REVIEW,
        shortlisted: statusMap.SHORTLISTED,
        interviewsScheduled: statusMap.INTERVIEW_SCHEDULED,
        hired: statusMap.HIRED,
      },
      statusDistribution: [
        { name: 'Applied', value: statusMap.APPLIED, color: '#6366f1' },
        { name: 'Under Review', value: statusMap.UNDER_REVIEW, color: '#8b5cf6' },
        { name: 'Shortlisted', value: statusMap.SHORTLISTED, color: '#06b6d4' },
        { name: 'Interviewing', value: statusMap.INTERVIEW_SCHEDULED, color: '#3b82f6' },
        { name: 'Hired', value: statusMap.HIRED, color: '#10b981' },
        { name: 'Rejected', value: statusMap.REJECTED, color: '#ef4444' },
      ].filter((item) => item.value > 0),
      jobDistribution: jobDistribution.slice(0, 6),
      upcomingInterviews,
      recentApplicants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Candidate Dashboard Analytics
// @route   GET /api/analytics/candidate
// @access  Private (Candidate)
export const getCandidateAnalytics = async (req, res, next) => {
  try {
    const [
      profile,
      applications,
      upcomingInterviews,
      totalActiveJobs,
    ] = await Promise.all([
      CandidateProfile.findOne({ user: req.user.id }).populate('activeResume'),
      Application.find({ candidate: req.user.id })
        .populate({
          path: 'job',
          select: 'title company location salaryMin salaryMax status',
          populate: { path: 'company', select: 'name logo' },
        })
        .sort({ createdAt: -1 }),
      Interview.find({
        candidate: req.user.id,
        scheduledDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: 'scheduled',
      })
        .populate('job', 'title location')
        .populate('recruiter', 'name email phone avatar')
        .sort({ scheduledDate: 1 })
        .limit(4),
      Job.countDocuments({ status: 'active', isDeleted: false }),
    ]);

    const statusCounts = {};
    applications.forEach((app) => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const avgMatchScore =
      applications.length > 0
        ? Math.round(
            applications.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) /
              applications.length
          )
        : 0;

    return sendSuccess(res, 'Candidate analytics generated', {
      profileCompletion: profile?.completionPercentage || 25,
      metrics: {
        totalApplications: applications.length,
        underReview: (statusCounts[APPLICATION_STATUS.UNDER_REVIEW] || 0) + (statusCounts[APPLICATION_STATUS.APPLIED] || 0),
        shortlisted: statusCounts[APPLICATION_STATUS.SHORTLISTED] || 0,
        interviewsScheduled: statusCounts[APPLICATION_STATUS.INTERVIEW_SCHEDULED] || 0,
        offers: statusCounts[APPLICATION_STATUS.OFFERED] || 0,
        hired: statusCounts[APPLICATION_STATUS.HIRED] || 0,
        totalActiveJobs,
        avgMatchScore,
      },
      recentApplications: applications.slice(0, 5),
      upcomingInterviews,
    });
  } catch (error) {
    next(error);
  }
};

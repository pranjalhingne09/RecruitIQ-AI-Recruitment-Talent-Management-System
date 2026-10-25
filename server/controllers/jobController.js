import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { JobCategory } from '../models/JobCategory.js';
import { sendSuccess, sendCreated, sendError } from '../utils/apiResponse.js';
import { normalizeSkillName } from '../config/skillsDictionary.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all jobs with filtering, search, and pagination
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      employmentType,
      experienceLevel,
      category,
      minSalary,
      maxSalary,
      skill,
      status = 'active',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = { isDeleted: false };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (employmentType && employmentType !== 'all') {
      query.employmentType = employmentType;
    }

    if (experienceLevel && experienceLevel !== 'all') {
      query.experienceLevel = experienceLevel;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minSalary) {
      query.salaryMin = { $gte: Number(minSalary) };
    }

    if (maxSalary) {
      query.salaryMax = { $lte: Number(maxSalary) };
    }

    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const sortOption = {};
    if (sortBy === 'salary') {
      sortOption.salaryMax = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'applicants') {
      sortOption.applicantsCount = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company', 'name logo website industry location')
        .populate('category', 'name icon')
        .populate('recruiter', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);

    return sendSuccess(res, 'Jobs retrieved successfully', jobs, 200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isDeleted: false })
      .populate('company')
      .populate('category')
      .populate('recruiter', 'name email avatar phone');

    if (!job) {
      return sendError(res, 'Job posting not found', 404);
    }

    // Increment views counter asynchronously
    Job.findByIdAndUpdate(job._id, { $inc: { viewsCount: 1 } }).exec();

    return sendSuccess(res, 'Job retrieved successfully', job);
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
export const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id, isDeleted: false })
      .populate('company', 'name logo')
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Recruiter jobs retrieved successfully', jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job vacancy
// @route   POST /api/jobs
// @access  Private (Recruiter)
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      requirements,
      responsibilities,
      requiredSkills,
      niceToHaveSkills,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      deadline,
      status,
    } = req.body;

    // Retrieve or verify recruiter's company
    const profile = await RecruiterProfile.findOne({ user: req.user.id });
    let companyId = profile?.company;

    if (!companyId) {
      const company = await Company.findOne({ createdBy: req.user.id });
      if (!company) {
        return sendError(res, 'Please set up your company profile before posting a job vacancy.', 400);
      }
      companyId = company._id;
    }

    // Normalize required skills and nice-to-have skills
    const cleanedRequiredSkills = Array.isArray(requiredSkills)
      ? Array.from(new Set(requiredSkills.map((s) => normalizeSkillName(s)).filter(Boolean)))
      : [];

    const cleanedNiceSkills = Array.isArray(niceToHaveSkills)
      ? Array.from(new Set(niceToHaveSkills.map((s) => normalizeSkillName(s)).filter(Boolean)))
      : [];

    const job = await Job.create({
      title,
      recruiter: req.user.id,
      company: companyId,
      category: category || null,
      description,
      requirements: requirements || '',
      responsibilities: responsibilities || '',
      requiredSkills: cleanedRequiredSkills,
      niceToHaveSkills: cleanedNiceSkills,
      location,
      employmentType: employmentType || 'Full-time',
      experienceLevel: experienceLevel || 'Mid',
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      salaryCurrency: salaryCurrency || 'USD',
      deadline: deadline ? new Date(deadline) : null,
      status: status || 'active',
    });

    if (category) {
      await JobCategory.findByIdAndUpdate(category, { $inc: { jobCount: 1 } });
    }

    await logAudit({
      userId: req.user.id,
      action: 'JOB_CREATED',
      resource: 'Job',
      resourceId: job._id,
      details: { title: job.title },
      req,
    });

    return sendCreated(res, 'Job published successfully', job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job vacancy
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isDeleted: false });

    if (!job) {
      return sendError(res, 'Job vacancy not found', 404);
    }

    // Validate ownership: only the recruiter who created it or admin can modify
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized. You cannot modify another recruiter’s job posting.', 403);
    }

    const {
      title,
      category,
      description,
      requirements,
      responsibilities,
      requiredSkills,
      niceToHaveSkills,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      deadline,
      status,
    } = req.body;

    if (title) job.title = title;
    if (category !== undefined) job.category = category;
    if (description) job.description = description;
    if (requirements !== undefined) job.requirements = requirements;
    if (responsibilities !== undefined) job.responsibilities = responsibilities;
    if (location) job.location = location;
    if (employmentType) job.employmentType = employmentType;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (salaryMin !== undefined) job.salaryMin = salaryMin;
    if (salaryMax !== undefined) job.salaryMax = salaryMax;
    if (salaryCurrency) job.salaryCurrency = salaryCurrency;
    if (deadline !== undefined) job.deadline = deadline;
    if (status) job.status = status;

    if (requiredSkills && Array.isArray(requiredSkills)) {
      job.requiredSkills = Array.from(new Set(requiredSkills.map((s) => normalizeSkillName(s)).filter(Boolean)));
    }
    if (niceToHaveSkills && Array.isArray(niceToHaveSkills)) {
      job.niceToHaveSkills = Array.from(new Set(niceToHaveSkills.map((s) => normalizeSkillName(s)).filter(Boolean)));
    }

    await job.save();

    await logAudit({
      userId: req.user.id,
      action: 'JOB_UPDATED',
      resource: 'Job',
      resourceId: job._id,
      details: { title: job.title },
      req,
    });

    return sendSuccess(res, 'Job posting updated successfully', job);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle job status (active/closed)
// @route   PATCH /api/jobs/:id/status
// @access  Private (Recruiter)
export const toggleJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isDeleted: false });
    if (!job) {
      return sendError(res, 'Job posting not found', 404);
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized to modify this job status.', 403);
    }

    job.status = job.status === 'active' ? 'closed' : 'active';
    await job.save();

    return sendSuccess(res, `Job vacancy marked as ${job.status}`, job);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter / Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.isDeleted) {
      return sendError(res, 'Job posting not found', 404);
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized. You cannot delete another recruiter’s job posting.', 403);
    }

    job.isDeleted = true;
    job.status = 'closed';
    await job.save();

    if (job.category) {
      await JobCategory.findByIdAndUpdate(job.category, { $inc: { jobCount: -1 } });
    }

    await logAudit({
      userId: req.user.id,
      action: 'JOB_DELETED',
      resource: 'Job',
      resourceId: job._id,
      req,
    });

    return sendSuccess(res, 'Job vacancy deleted successfully');
  } catch (error) {
    next(error);
  }
};

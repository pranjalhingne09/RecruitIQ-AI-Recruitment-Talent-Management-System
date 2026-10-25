import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { JobCategory } from '../models/JobCategory.js';
import { AuditLog } from '../models/AuditLog.js';
import { Application } from '../models/Application.js';
import { sendSuccess, sendCreated, sendError } from '../utils/apiResponse.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    return sendSuccess(res, 'Users retrieved', users, 200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate or deactivate user account
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Prevent deactivating own account
    if (user._id.toString() === req.user.id) {
      return sendError(res, 'Administrators cannot deactivate their own account.', 400);
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAudit({
      userId: req.user.id,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      resource: 'User',
      resourceId: user._id,
      details: { targetEmail: user.email, newStatus: user.isActive },
      req,
    });

    return sendSuccess(
      res,
      `User ${user.name} has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (Admin moderation)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company', 'name industry')
        .populate('recruiter', 'name email')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);

    return sendSuccess(res, 'All platform jobs retrieved', jobs, 200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate / delete job as Admin
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
export const deleteJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return sendError(res, 'Job posting not found', 404);
    }

    job.isDeleted = true;
    job.status = 'closed';
    await job.save();

    await logAudit({
      userId: req.user.id,
      action: 'ADMIN_JOB_REMOVED',
      resource: 'Job',
      resourceId: job._id,
      details: { title: job.title },
      req,
    });

    return sendSuccess(res, 'Job vacancy removed by administrator.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories
// @route   GET /api/admin/categories
// @access  Public / Private
export const getCategories = async (req, res, next) => {
  try {
    const categories = await JobCategory.find().sort({ name: 1 });
    return sendSuccess(res, 'Categories retrieved', categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create job category
// @route   POST /api/admin/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return sendError(res, 'Category name is required', 400);
    }

    const existing = await JobCategory.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (existing) {
      return sendError(res, 'Category already exists', 409);
    }

    const category = await JobCategory.create({
      name: name.trim(),
      description: description || '',
      icon: icon || 'Briefcase',
    });

    await logAudit({
      userId: req.user.id,
      action: 'CATEGORY_CREATED',
      resource: 'JobCategory',
      resourceId: category._id,
      details: { name: category.name },
      req,
    });

    return sendCreated(res, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, active } = req.body;
    const category = await JobCategory.findById(req.params.id);
    if (!category) {
      return sendError(res, 'Category not found', 404);
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (active !== undefined) category.active = active;

    await category.save();
    return sendSuccess(res, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.findById(req.params.id);
    if (!category) {
      return sendError(res, 'Category not found', 404);
    }

    await JobCategory.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get system audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, resource, page = 1, limit = 30 } = req.query;
    const query = {};

    if (action && action !== 'all') {
      query.action = action;
    }
    if (resource && resource !== 'all') {
      query.resource = resource;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      AuditLog.countDocuments(query),
    ]);

    return sendSuccess(res, 'Audit logs retrieved', logs, 200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

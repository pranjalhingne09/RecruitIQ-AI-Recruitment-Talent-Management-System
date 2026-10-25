import { User } from '../models/User.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { Company } from '../models/Company.js';
import { sendTokenResponse } from '../utils/tokenUtils.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logAudit } from '../middleware/auditMiddleware.js';

// @desc    Register a new Candidate
// @route   POST /api/auth/register/candidate
// @access  Public
export const registerCandidate = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 409);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'candidate',
    });

    // Automatically create empty candidate profile
    await CandidateProfile.create({
      user: user._id,
      headline: '',
      skills: [],
    });

    await logAudit({
      userId: user._id,
      action: 'USER_REGISTER_CANDIDATE',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email },
      req,
    });

    return sendTokenResponse(user, 201, res, 'Candidate account registered successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new Recruiter
// @route   POST /api/auth/register/recruiter
// @access  Public
export const registerRecruiter = async (req, res, next) => {
  try {
    const { name, email, password, phone, companyName, position, industry, website, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 409);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'recruiter',
    });

    // Create Company
    const company = await Company.create({
      name: companyName,
      website: website || '',
      industry: industry || 'Technology',
      location: location || '',
      createdBy: user._id,
    });

    // Create Recruiter Profile linked to company
    await RecruiterProfile.create({
      user: user._id,
      company: company._id,
      position: position || 'Talent Acquisition',
      phone: phone || '',
    });

    await logAudit({
      userId: user._id,
      action: 'USER_REGISTER_RECRUITER',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email, companyName },
      req,
    });

    return sendTokenResponse(user, 201, res, 'Recruiter account registered successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'This account has been deactivated. Please contact an administrator.', 403);
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    await logAudit({
      userId: user._id,
      action: 'USER_LOGIN',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email },
      req,
    });

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return sendSuccess(res, 'Logged out successfully.');
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ user: user._id }).populate('activeResume');
    } else if (user.role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ user: user._id }).populate('company');
    }

    return sendSuccess(res, 'User profile retrieved', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

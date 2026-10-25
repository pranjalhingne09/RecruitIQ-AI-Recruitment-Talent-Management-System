import { CandidateProfile } from '../models/CandidateProfile.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { normalizeSkillName } from '../config/skillsDictionary.js';

// @desc    Get Candidate Profile
// @route   GET /api/candidates/profile
// @access  Private (Candidate)
export const getProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar')
      .populate('activeResume');

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.user.id,
        skills: [],
      });
      await profile.populate('user', 'name email phone avatar');
    }

    return sendSuccess(res, 'Candidate profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Candidate Profile
// @route   PUT /api/candidates/profile
// @access  Private (Candidate)
export const updateProfile = async (req, res, next) => {
  try {
    const { headline, bio, location, education, experience, skills, socialLinks, activeResume } = req.body;

    let profile = await CandidateProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new CandidateProfile({ user: req.user.id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (education !== undefined) profile.education = education;
    if (experience !== undefined) profile.experience = experience;
    if (socialLinks !== undefined) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    if (activeResume !== undefined) profile.activeResume = activeResume;

    if (skills && Array.isArray(skills)) {
      // Normalize skills
      const cleanedSkills = Array.from(
        new Set(skills.map((s) => normalizeSkillName(s)).filter(Boolean))
      );
      profile.skills = cleanedSkills;
    }

    await profile.save();
    await profile.populate('activeResume');

    return sendSuccess(res, 'Profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Candidate's Applications
// @route   GET /api/candidates/applications
// @access  Private (Candidate)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        select: 'title location employmentType salaryMin salaryMax salaryCurrency status company',
        populate: {
          path: 'company',
          select: 'name logo location industry',
        },
      })
      .populate('resume', 'originalName fileName filePath createdAt')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Applications retrieved', applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Candidate's Scheduled Interviews
// @route   GET /api/candidates/interviews
// @access  Private (Candidate)
export const getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location',
        populate: { path: 'company', select: 'name logo' },
      })
      .populate('recruiter', 'name email phone avatar')
      .sort({ scheduledDate: 1 });

    return sendSuccess(res, 'Interviews retrieved', interviews);
  } catch (error) {
    next(error);
  }
};

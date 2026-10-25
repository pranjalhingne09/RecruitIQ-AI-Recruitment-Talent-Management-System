import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { Company } from '../models/Company.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    let profile = await RecruiterProfile.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar')
      .populate('company');

    if (!profile) {
      profile = await RecruiterProfile.create({
        user: req.user.id,
      });
      await profile.populate('user', 'name email phone avatar');
    }

    return sendSuccess(res, 'Recruiter profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { position, department, phone, companyId } = req.body;

    let profile = await RecruiterProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new RecruiterProfile({ user: req.user.id });
    }

    if (position !== undefined) profile.position = position;
    if (department !== undefined) profile.department = department;
    if (phone !== undefined) profile.phone = phone;
    if (companyId) {
      profile.company = companyId;
    }

    await profile.save();
    await profile.populate('company');

    return sendSuccess(res, 'Recruiter profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

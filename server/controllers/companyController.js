import { Company } from '../models/Company.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    let company;
    if (id) {
      company = await Company.findById(id);
    } else {
      // Find company of the current logged-in recruiter
      const profile = await RecruiterProfile.findOne({ user: req.user.id });
      if (profile && profile.company) {
        company = await Company.findById(profile.company);
      } else {
        company = await Company.findOne({ createdBy: req.user.id });
      }
    }

    if (!company) {
      return sendError(res, 'Company profile not found', 404);
    }

    return sendSuccess(res, 'Company profile retrieved', company);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { name, logo, website, industry, description, location, size } = req.body;

    const profile = await RecruiterProfile.findOne({ user: req.user.id });
    let company;

    if (profile && profile.company) {
      company = await Company.findById(profile.company);
    } else {
      company = await Company.findOne({ createdBy: req.user.id });
    }

    if (!company) {
      // Create one if not existing
      company = new Company({
        name: name || 'My Company',
        createdBy: req.user.id,
      });
    }

    if (name) company.name = name;
    if (logo !== undefined) company.logo = logo;
    if (website !== undefined) company.website = website;
    if (industry !== undefined) company.industry = industry;
    if (description !== undefined) company.description = description;
    if (location !== undefined) company.location = location;
    if (size !== undefined) company.size = size;

    await company.save();

    // Ensure recruiter profile points to this company
    if (profile && (!profile.company || profile.company.toString() !== company._id.toString())) {
      profile.company = company._id;
      await profile.save();
    }

    return sendSuccess(res, 'Company details saved successfully', company);
  } catch (error) {
    next(error);
  }
};

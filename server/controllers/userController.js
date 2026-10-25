import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logAudit } from '../middleware/auditMiddleware.js';

export const updateUserDetails = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return sendSuccess(res, 'User details updated successfully', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 'Please provide both current and new password.', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters.', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return sendError(res, 'Current password is incorrect.', 401);
    }

    user.password = newPassword;
    await user.save();

    await logAudit({
      userId: user._id,
      action: 'USER_PASSWORD_CHANGE',
      resource: 'User',
      resourceId: user._id,
      req,
    });

    return sendSuccess(res, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};

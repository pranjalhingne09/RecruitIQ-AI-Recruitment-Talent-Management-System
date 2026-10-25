import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
      index: true,
    },
    position: {
      type: String,
      default: 'Recruiter',
      trim: true,
    },
    department: {
      type: String,
      default: 'Human Resources',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);

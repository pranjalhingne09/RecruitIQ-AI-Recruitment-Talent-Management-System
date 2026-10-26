import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      index: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobCategory',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      default: '',
    },
    responsibilities: {
      type: String,
      default: '',
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    niceToHaveSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
      default: 'Full-time',
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Lead'],
      default: 'Mid',
      index: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryCurrency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
      index: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Slugify title + random suffix
jobSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
  }
  next();
});

// Text index for search across title, description, and location
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

export const Job = mongoose.model('Job', jobSchema);

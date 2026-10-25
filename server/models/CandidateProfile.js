import mongoose from 'mongoose';

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      default: '',
      trim: true,
      maxlength: [150, 'Headline cannot exceed 150 characters'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, default: '' },
        startYear: { type: Number },
        endYear: { type: Number },
        grade: { type: String, default: '' },
      },
    ],
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, default: '' },
        startDate: { type: Date },
        endDate: { type: Date },
        isCurrent: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    activeResume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    completionPercentage: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate profile completion percentage automatically before saving
candidateProfileSchema.pre('save', function (next) {
  let score = 20; // Base score for having user profile created
  if (this.headline && this.headline.trim()) score += 15;
  if (this.bio && this.bio.trim()) score += 15;
  if (this.location && this.location.trim()) score += 10;
  if (this.skills && this.skills.length > 0) score += 15;
  if (this.education && this.education.length > 0) score += 10;
  if (this.experience && this.experience.length > 0) score += 10;
  if (this.activeResume) score += 5;
  this.completionPercentage = Math.min(score, 100);
  next();
});

export const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);

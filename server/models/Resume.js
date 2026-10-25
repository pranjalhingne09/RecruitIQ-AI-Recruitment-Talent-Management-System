import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    extractedSkills: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    parseStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    parseError: {
      type: String,
      default: '',
    },
    analysisMetadata: {
      wordCount: { type: Number, default: 0 },
      detectedEmail: { type: String, default: '' },
      detectedPhone: { type: String, default: '' },
      detectedExperienceYears: { type: Number, default: 0 },
      topSkillCategories: [{ category: String, count: Number }],
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model('Resume', resumeSchema);

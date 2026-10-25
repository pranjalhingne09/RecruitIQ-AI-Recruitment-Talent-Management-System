import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { SKILLS_MASTER_LIST, SKILL_CATEGORIES } from '../config/skillsDictionary.js';

/**
 * Extracts raw text from uploaded resume (PDF or DOCX)
 */
export const extractTextFromFile = async (filePath, mimeType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist on disk.');
  }

  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === '.pdf' || mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text || '';
    } else if (
      ext === '.docx' ||
      ext === '.doc' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    } else {
      throw new Error(`Unsupported document extension '${ext}'. Only .pdf and .docx are supported.`);
    }
  } catch (error) {
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
};

/**
 * Extracts normalized skills from text using the configured skills dictionary
 */
export const extractSkillsFromText = (text) => {
  if (!text || typeof text !== 'string') return [];

  const matchedSkillsSet = new Set();

  for (const skillItem of SKILLS_MASTER_LIST) {
    if (skillItem.pattern.test(text)) {
      matchedSkillsSet.add(skillItem.name);
    }
  }

  return Array.from(matchedSkillsSet);
};

/**
 * Parses basic resume metadata like email, phone, estimated years of experience
 */
export const extractMetadataFromText = (text, extractedSkills = []) => {
  if (!text) {
    return {
      wordCount: 0,
      detectedEmail: '',
      detectedPhone: '',
      detectedExperienceYears: 0,
      topSkillCategories: [],
    };
  }

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const detectedEmail = emailMatch ? emailMatch[0].toLowerCase() : '';

  // Extract phone (common formats)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const detectedPhone = phoneMatch ? phoneMatch[0].trim() : '';

  // Estimate experience in years (looking for phrases like "X years of experience", "X+ years")
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i);
  let detectedExperienceYears = expMatch ? parseInt(expMatch[1], 10) : 0;
  if (detectedExperienceYears > 40) detectedExperienceYears = 0; // Sanity check

  // Group matched skills by category
  const categoryCounts = {};
  for (const skillName of extractedSkills) {
    const item = SKILLS_MASTER_LIST.find((s) => s.name === skillName);
    const cat = item ? item.category : 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const topSkillCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    wordCount,
    detectedEmail,
    detectedPhone,
    detectedExperienceYears,
    topSkillCategories,
  };
};

/**
 * Complete Resume Analysis Pipeline
 */
export const analyzeResumeDocument = async (filePath, mimeType) => {
  const extractedText = await extractTextFromFile(filePath, mimeType);

  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('Document is empty or unreadable text could not be extracted.');
  }

  const extractedSkills = extractSkillsFromText(extractedText);
  const metadata = extractMetadataFromText(extractedText, extractedSkills);

  return {
    extractedText,
    extractedSkills,
    metadata,
  };
};

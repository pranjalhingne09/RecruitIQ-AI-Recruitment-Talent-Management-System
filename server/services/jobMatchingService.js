import { normalizeSkillName } from '../config/skillsDictionary.js';

/**
 * Calculates transparent, explainable skill match between a candidate's skills and a job's requirements
 *
 * @param {Array<string>} candidateSkills - List of candidate skills (from profile and/or resume)
 * @param {Array<string>} requiredSkills - List of required job skills
 * @param {Array<string>} niceToHaveSkills - Optional nice-to-have job skills
 * @returns {Object} Transparent score and explainable breakdown
 */
export const calculateSkillMatch = (
  candidateSkills = [],
  requiredSkills = [],
  niceToHaveSkills = []
) => {
  // Normalize candidate skills
  const normalizedCandidateSkills = (candidateSkills || [])
    .map((s) => normalizeSkillName(s).toLowerCase())
    .filter(Boolean);

  const candidateSkillsSet = new Set(normalizedCandidateSkills);

  // Normalize required skills
  const normalizedRequiredSkills = (requiredSkills || [])
    .map((s) => ({
      original: s,
      normalized: normalizeSkillName(s).toLowerCase(),
    }))
    .filter((s) => s.normalized);

  // Normalize nice-to-have skills
  const normalizedNiceToHave = (niceToHaveSkills || [])
    .map((s) => ({
      original: s,
      normalized: normalizeSkillName(s).toLowerCase(),
    }))
    .filter((s) => s.normalized);

  const matchedRequired = [];
  const missingRequired = [];

  for (const skill of normalizedRequiredSkills) {
    if (candidateSkillsSet.has(skill.normalized)) {
      matchedRequired.push(skill.original);
    } else {
      missingRequired.push(skill.original);
    }
  }

  const matchedNiceToHave = [];
  for (const skill of normalizedNiceToHave) {
    if (candidateSkillsSet.has(skill.normalized)) {
      matchedNiceToHave.push(skill.original);
    }
  }

  const totalRequired = normalizedRequiredSkills.length;
  let baseScore = 0;

  if (totalRequired === 0) {
    baseScore = 100; // If job specifies no specific required skills
  } else {
    baseScore = Math.round((matchedRequired.length / totalRequired) * 100);
  }

  // Optional nice-to-have bonus (up to 10% bonus, clamped at 100)
  let bonus = 0;
  if (normalizedNiceToHave.length > 0 && matchedNiceToHave.length > 0) {
    bonus = Math.round((matchedNiceToHave.length / normalizedNiceToHave.length) * 10);
  }

  const finalScore = Math.min(100, Math.max(0, baseScore + bonus));

  // Build human-readable explanation
  let explanation = '';
  if (totalRequired === 0) {
    explanation = 'This vacancy has no strict required skills listed; candidate meets all foundational criteria.';
  } else {
    explanation = `Candidate possesses ${matchedRequired.length} of ${totalRequired} required skills (${baseScore}%).`;
    if (missingRequired.length > 0) {
      explanation += ` Missing required skills: ${missingRequired.join(', ')}.`;
    } else {
      explanation += ' All mandatory skills are present.';
    }
    if (matchedNiceToHave.length > 0) {
      explanation += ` Candidate additionally brings ${matchedNiceToHave.length} preferred skill(s): ${matchedNiceToHave.join(', ')}.`;
    }
  }

  return {
    matchScore: finalScore,
    matchedSkills: matchedRequired,
    missingSkills: missingRequired,
    matchedNiceToHave,
    scoreBreakdown: {
      requiredSkillsTotal: totalRequired,
      requiredSkillsMatched: matchedRequired.length,
      niceToHaveMatched: matchedNiceToHave.length,
      formulaExplanation: `Match Score = (${matchedRequired.length} matched / ${totalRequired || 1} required) * 100 + ${bonus}% bonus = ${finalScore}%`,
    },
    explanation,
    disclaimer:
      'Decision Support Notice: This score reflects objective skill keyword alignment and is designed solely to assist human hiring teams. It does not automate hiring decisions or assess qualitative candidate potential.',
  };
};

/**
 * Ranks active jobs based on compatibility with a candidate's skills
 */
export const rankJobsForCandidate = (jobs = [], candidateSkills = []) => {
  return jobs
    .map((job) => {
      const matchResult = calculateSkillMatch(
        candidateSkills,
        job.requiredSkills || [],
        job.niceToHaveSkills || []
      );
      return {
        job,
        ...matchResult,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

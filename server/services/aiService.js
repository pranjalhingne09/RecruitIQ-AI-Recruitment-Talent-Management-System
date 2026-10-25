/**
 * AI Integration Service Architecture
 * Modular architecture providing AI resume screening enhancements.
 * Supports external Google Gemini API integration when GEMINI_API_KEY is configured.
 * Seamlessly falls back to transparent, robust local rule-based analytics when no external key is present.
 */

export const generateResumeInsights = async ({ resumeText, extractedSkills, jobRequirements = [] }) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. External AI Service Integration (Google Gemini API) if API key is provided
  if (geminiApiKey && geminiApiKey.trim() !== '') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert technical recruiter assistant. Analyze this candidate resume against the given job requirements.
Provide a concise JSON response with:
1. summary (2 sentences)
2. keyStrengths (array of 3 points)
3. developmentAreas (array of 2 points)
4. suggestedInterviewQuestions (array of 3 technical questions)

Job Requirements: ${JSON.stringify(jobRequirements)}
Extracted Skills: ${JSON.stringify(extractedSkills)}
Resume Text Sample: ${resumeText.substring(0, 3000)}

Respond ONLY with valid raw JSON without markdown code fences.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          engine: 'google-gemini-ai',
          isExternalAiActive: true,
          summary: parsed.summary || 'AI synthesis completed successfully.',
          keyStrengths: parsed.keyStrengths || [],
          developmentAreas: parsed.developmentAreas || [],
          suggestedInterviewQuestions: parsed.suggestedInterviewQuestions || [],
          disclaimer: 'Generated via Google Gemini AI API to support recruitment review.',
        };
      }
    } catch (err) {
      console.warn('External AI call failed, gracefully defaulting to local rule-based analysis:', err.message);
    }
  }

  // 2. High-Performance Local Rule-Based Engine (Fallback / Zero-Cost Default)
  // Transparently labeled as local rule-based engine per ethical requirements.
  const topSkills = extractedSkills.slice(0, 6);
  const skillCount = extractedSkills.length;

  const keyStrengths = [];
  if (skillCount > 8) {
    keyStrengths.push(`Broad technical repertoire with ${skillCount} verified core competencies.`);
  } else if (skillCount > 3) {
    keyStrengths.push(`Solid foundation in modern stack technologies (${topSkills.slice(0, 3).join(', ')}).`);
  }

  if (topSkills.some((s) => ['React', 'Vue.js', 'Angular', 'Next.js'].includes(s))) {
    keyStrengths.push('Demonstrated proficiency in modern interactive frontend architectures.');
  }
  if (topSkills.some((s) => ['Node.js', 'Express.js', 'Spring Boot', 'Django'].includes(s))) {
    keyStrengths.push('Demonstrated capability with server-side architecture and RESTful services.');
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push('Foundational problem solving and technical fundamentals.');
  }

  const developmentAreas = [];
  const missingJobSkills = jobRequirements.filter((req) => !extractedSkills.includes(req));
  if (missingJobSkills.length > 0) {
    developmentAreas.push(`Familiarity with job-specific stack tools: ${missingJobSkills.slice(0, 3).join(', ')}.`);
  } else {
    developmentAreas.push('Continuous integration and scalable cloud deployment workflows.');
  }

  const suggestedQuestions = [
    `Can you describe an architecture challenge you tackled using ${topSkills[0] || 'your core programming language'}?`,
    `How do you approach testing, debugging, and maintaining performance in ${topSkills[1] || 'your applications'}?`,
    'Walk us through how you collaborate with team members across design, backend, and product delivery.',
  ];

  return {
    engine: 'local-rule-based-engine',
    isExternalAiActive: false,
    summary: `Profile demonstrates core competency across ${skillCount} detected skills, with emphasis on ${topSkills.slice(0, 4).join(', ') || 'software development fundamentals'}.`,
    keyStrengths,
    developmentAreas,
    suggestedInterviewQuestions: suggestedQuestions,
    disclaimer: 'Decision Support: Generated using RecruitIQ local rule-based skill extraction engine.',
  };
};

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { calculateSkillMatch } from '../services/jobMatchingService.js';
import { extractSkillsFromText, extractMetadataFromText } from '../services/resumeAnalysisService.js';
import { normalizeSkillName } from '../config/skillsDictionary.js';

describe('RecruitIQ Core Engine & API Suite', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recruitiq';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    // Keep connection intact or disconnect cleanly
    await mongoose.connection.close();
  });

  describe('1. Explainable Skill Matching Algorithm & Resume Extraction', () => {
    it('accurately calculates match score: 3 of 4 skills matched = 75%', () => {
      const candidateSkills = ['React', 'Node.js', 'TypeScript', 'Docker'];
      const requiredSkills = ['React', 'Node.js', 'MongoDB', 'TypeScript'];
      const niceToHave = ['AWS'];

      const result = calculateSkillMatch(candidateSkills, requiredSkills, niceToHave);

      expect(result.matchScore).toBe(75);
      expect(result.matchedSkills).toEqual(expect.arrayContaining(['React', 'Node.js', 'TypeScript']));
      expect(result.missingSkills).toEqual(['MongoDB']);
      expect(result.explanation).toContain('Candidate possesses 3 of 4 required skills (75%)');
      expect(result.disclaimer).toBeDefined();
    });

    it('safely handles jobs with zero required skills without dividing by zero', () => {
      const candidateSkills = ['Python', 'SQL'];
      const result = calculateSkillMatch(candidateSkills, [], []);

      expect(result.matchScore).toBe(100);
      expect(result.missingSkills).toHaveLength(0);
    });

    it('awards nice-to-have bonus clamped at 100%', () => {
      const candidateSkills = ['React', 'Node.js', 'AWS'];
      const requiredSkills = ['React', 'Node.js'];
      const niceToHave = ['AWS'];

      const result = calculateSkillMatch(candidateSkills, requiredSkills, niceToHave);
      expect(result.matchScore).toBe(100);
      expect(result.matchedNiceToHave).toContain('AWS');
    });

    it('prevents substring false-positives for "C" vs "CSS" and "Java" vs "JavaScript"', () => {
      const text1 = 'Proficient in CSS, Cascading Style Sheets, and HTML5.';
      const extracted1 = extractSkillsFromText(text1);
      expect(extracted1).toContain('CSS');
      expect(extracted1).not.toContain('C'); // Must NOT match "C" inside "CSS" or "Cascading"

      const text2 = 'Experienced JavaScript front-end developer.';
      const extracted2 = extractSkillsFromText(text2);
      expect(extracted2).toContain('JavaScript');
      expect(extracted2).not.toContain('Java'); // Must NOT match "Java" inside "JavaScript"

      const text3 = 'Embedded systems programming in C language.';
      const extracted3 = extractSkillsFromText(text3);
      expect(extracted3).toContain('C');
    });

    it('extracts metadata and emails from raw resume text', () => {
      const resumeText = 'Software Engineer John Doe. Email: test.engineer@domain.com. Phone: (555) 123-4567. 6 years of experience.';
      const meta = extractMetadataFromText(resumeText, ['React', 'Node.js']);

      expect(meta.detectedEmail).toBe('test.engineer@domain.com');
      expect(meta.detectedExperienceYears).toBe(6);
      expect(meta.wordCount).toBeGreaterThan(10);
    });
  });

  describe('2. Authentication & Authorization APIs', () => {
    let candidateToken = '';
    let recruiterToken = '';
    const testCandidateEmail = `cand_${Date.now()}@test.com`;
    const testRecruiterEmail = `rec_${Date.now()}@test.com`;

    it('registers candidate successfully with 201 Created and JWT', async () => {
      const res = await request(app)
        .post('/api/auth/register/candidate')
        .send({
          name: 'Test Candidate',
          email: testCandidateEmail,
          password: 'Password@123',
          phone: '+1 555-0199',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('candidate');
      candidateToken = res.body.token;
    });

    it('prevents duplicate email registration with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/auth/register/candidate')
        .send({
          name: 'Duplicate Candidate',
          email: testCandidateEmail,
          password: 'Password@123',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('registers recruiter successfully and creates linked company', async () => {
      const res = await request(app)
        .post('/api/auth/register/recruiter')
        .send({
          name: 'Test Recruiter',
          email: testRecruiterEmail,
          password: 'Password@123',
          companyName: 'Apex Innovations',
          position: 'Talent Director',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('recruiter');
      recruiterToken = res.body.token;
    });

    it('authenticates user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCandidateEmail,
          password: 'Password@123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('rejects invalid password credentials with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testCandidateEmail,
          password: 'WrongPassword999',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('enforces RBAC: candidate cannot post a job (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          title: 'Unauthorized Job',
          description: 'This should fail.',
          location: 'Remote',
          requiredSkills: ['React'],
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('allows recruiter to create a new job vacancy', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Software Development Engineer II',
          description: 'Building next-generation fintech systems.',
          location: 'San Francisco, CA / Remote',
          employmentType: 'Full-time',
          experienceLevel: 'Mid',
          salaryMin: 120000,
          salaryMax: 160000,
          requiredSkills: ['React', 'Node.js', 'MongoDB'],
          niceToHaveSkills: ['Docker'],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Software Development Engineer II');
      expect(res.body.data.requiredSkills).toContain('React');
    });
  });

  describe('3. Job Search, Filtering, and Applications', () => {
    it('retrieves active jobs with pagination metadata', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBeGreaterThan(0);
    });

    it('filters jobs by search query keyword', async () => {
      const res = await request(app).get('/api/jobs?search=Machine Learning');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.some((j) => j.title.includes('Machine Learning'))).toBe(true);
    });

    it('health check endpoint responds with 200 OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });
});

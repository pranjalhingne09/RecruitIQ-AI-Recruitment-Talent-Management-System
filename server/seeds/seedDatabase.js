import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { User } from '../models/User.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { Company } from '../models/Company.js';
import { JobCategory } from '../models/JobCategory.js';
import { Job } from '../models/Job.js';
import { Resume } from '../models/Resume.js';
import { Application, APPLICATION_STATUS } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';
import { calculateSkillMatch } from '../services/jobMatchingService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads/resumes');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recruitiq';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB. Clearing existing collections...');

    // Clear collections
    await Promise.all([
      User.deleteMany(),
      CandidateProfile.deleteMany(),
      RecruiterProfile.deleteMany(),
      Company.deleteMany(),
      JobCategory.deleteMany(),
      Job.deleteMany(),
      Resume.deleteMany(),
      Application.deleteMany(),
      Interview.deleteMany(),
      Notification.deleteMany(),
      AuditLog.deleteMany(),
    ]);

    console.log('🌱 Seeding Job Categories...');
    const categories = await JobCategory.create([
      { name: 'Software Engineering', icon: 'Code', description: 'Full stack, backend, and frontend engineering roles.' },
      { name: 'AI & Data Science', icon: 'Cpu', description: 'Machine learning, deep learning, NLP, and data intelligence.' },
      { name: 'Cloud & DevOps', icon: 'Cloud', description: 'Infrastructure, Kubernetes, CI/CD, and cloud platforms.' },
      { name: 'Mobile Development', icon: 'Smartphone', description: 'iOS, Android, React Native, and Flutter development.' },
      { name: 'Product & Design', icon: 'Layout', description: 'UI/UX design, product management, and user research.' },
    ]);

    console.log('🌱 Seeding Admin User...');
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@recruitiq.com',
      password: 'Admin@123456',
      role: 'admin',
      isActive: true,
      phone: '+1 (555) 019-2831',
    });

    console.log('🌱 Seeding Recruiters & Companies...');
    // Recruiter 1: Sarah Chen (Google)
    const sarahUser = await User.create({
      name: 'Sarah Chen',
      email: 'recruiter@google.com',
      password: 'Password@123',
      role: 'recruiter',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      phone: '+1 (650) 253-0000',
    });

    const googleCompany = await Company.create({
      name: 'Google LLC',
      logo: 'https://www.google.com/favicon.ico',
      website: 'https://careers.google.com',
      industry: 'Technology & Cloud',
      location: 'Mountain View, CA',
      size: '1000+',
      description: 'Google is a global technology leader focused on improving the ways people connect with information.',
      createdBy: sarahUser._id,
    });

    await RecruiterProfile.create({
      user: sarahUser._id,
      company: googleCompany._id,
      position: 'Staff Technical Recruiter',
      department: 'Cloud & Core Infrastructure',
    });

    // Recruiter 2: Marcus Vance (Stripe)
    const marcusUser = await User.create({
      name: 'Marcus Vance',
      email: 'recruiter@stripe.com',
      password: 'Password@123',
      role: 'recruiter',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+1 (415) 555-8921',
    });

    const stripeCompany = await Company.create({
      name: 'Stripe',
      logo: 'https://stripe.com/favicon.ico',
      website: 'https://stripe.com/jobs',
      industry: 'Financial Technology',
      location: 'San Francisco, CA',
      size: '1000+',
      description: 'Stripe is a financial infrastructure platform for businesses millions of companies use.',
      createdBy: marcusUser._id,
    });

    await RecruiterProfile.create({
      user: marcusUser._id,
      company: stripeCompany._id,
      position: 'Head of Engineering Talent',
      department: 'Payments & Infrastructure',
    });

    console.log('🌱 Seeding Candidates & Profiles...');
    // Candidate 1: Alex Rivers (Senior Full Stack)
    const alexUser = await User.create({
      name: 'Alex Rivers',
      email: 'alex.rivers@gmail.com',
      password: 'Password@123',
      role: 'candidate',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+1 (415) 890-1234',
    });

    // Write a dummy resume file for Alex
    const alexResumePath = path.join(uploadsDir, 'alex_rivers_resume.pdf');
    fs.writeFileSync(alexResumePath, 'Alex Rivers - Senior Full Stack Engineer. Skills: React, Node.js, Express.js, TypeScript, MongoDB, Docker, AWS, REST API, Git, JavaScript, HTML, CSS.');

    const alexResume = await Resume.create({
      candidate: alexUser._id,
      originalName: 'Alex_Rivers_FullStack_Resume.pdf',
      fileName: 'alex_rivers_resume.pdf',
      filePath: alexResumePath,
      mimeType: 'application/pdf',
      fileSize: 10240,
      extractedText: 'Alex Rivers - Senior Full Stack Engineer with 5+ years of experience building web applications with React, Node.js, Express.js, TypeScript, MongoDB, Docker, and AWS.',
      extractedSkills: ['React', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS', 'REST API', 'Git', 'JavaScript', 'HTML', 'CSS'],
      parseStatus: 'success',
      analysisMetadata: {
        wordCount: 320,
        detectedEmail: 'alex.rivers@gmail.com',
        detectedPhone: '+1 (415) 890-1234',
        detectedExperienceYears: 5,
      },
    });

    await CandidateProfile.create({
      user: alexUser._id,
      headline: 'Senior Full-Stack Engineer | React • Node.js • Cloud Architecture',
      bio: 'Passionate software craftsman building scalable web systems and elegant developer tools.',
      location: 'San Francisco, CA',
      skills: ['React', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS', 'REST API', 'JavaScript', 'HTML', 'CSS'],
      activeResume: alexResume._id,
      education: [
        {
          school: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science',
          fieldOfStudy: 'Computer Systems',
          startYear: 2017,
          endYear: 2021,
          grade: '3.9 GPA',
        },
      ],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Vercel Ecosystem Labs',
          location: 'San Francisco, CA',
          startDate: new Date('2021-06-01'),
          isCurrent: true,
          description: 'Architected scalable microservices, reduced API response latency by 45%, and spearheaded frontend performance refactoring.',
        },
      ],
      socialLinks: {
        github: 'https://github.com/alexrivers',
        linkedin: 'https://linkedin.com/in/alexrivers',
      },
    });

    // Candidate 2: Priya Sharma (AI / ML Engineer)
    const priyaUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      password: 'Password@123',
      role: 'candidate',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      phone: '+1 (408) 555-7812',
    });

    const priyaResumePath = path.join(uploadsDir, 'priya_sharma_resume.pdf');
    fs.writeFileSync(priyaResumePath, 'Priya Sharma - AI & Machine Learning Engineer. Skills: Python, PyTorch, TensorFlow, Machine Learning, Deep Learning, SQL, Pandas, NumPy, Data Structures, Git, Docker.');

    const priyaResume = await Resume.create({
      candidate: priyaUser._id,
      originalName: 'Priya_Sharma_ML_Resume.pdf',
      fileName: 'priya_sharma_resume.pdf',
      filePath: priyaResumePath,
      mimeType: 'application/pdf',
      fileSize: 12400,
      extractedText: 'Priya Sharma - AI & Machine Learning Engineer with 4 years of experience delivering neural networks, LLM fine-tuning, and production ML pipelines.',
      extractedSkills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'SQL', 'Pandas', 'NumPy', 'Data Structures', 'Git', 'Docker'],
      parseStatus: 'success',
      analysisMetadata: {
        wordCount: 450,
        detectedEmail: 'priya.sharma@gmail.com',
        detectedPhone: '+1 (408) 555-7812',
        detectedExperienceYears: 4,
      },
    });

    await CandidateProfile.create({
      user: priyaUser._id,
      headline: 'Machine Learning Engineer | Deep Learning & Generative AI',
      bio: 'Specializing in computer vision, generative foundation models, and scalable model serving pipelines.',
      location: 'San Jose, CA',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'SQL', 'Pandas', 'NumPy', 'Docker', 'Git'],
      activeResume: priyaResume._id,
      education: [
        {
          school: 'Stanford University',
          degree: 'M.S. in Artificial Intelligence',
          startYear: 2020,
          endYear: 2022,
        },
      ],
      experience: [
        {
          title: 'Machine Learning Specialist',
          company: 'Synthetix AI',
          location: 'Palo Alto, CA',
          startDate: new Date('2022-07-01'),
          isCurrent: true,
          description: 'Designed training pipelines for diffusion models and lowered inference compute costs by 30%.',
        },
      ],
      socialLinks: {
        github: 'https://github.com/priyasharma-ai',
        linkedin: 'https://linkedin.com/in/priyasharma',
      },
    });

    // Candidate 3: Jordan Taylor (Frontend Specialist)
    const jordanUser = await User.create({
      name: 'Jordan Taylor',
      email: 'jordan.taylor@gmail.com',
      password: 'Password@123',
      role: 'candidate',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      phone: '+1 (206) 555-9012',
    });

    const jordanResumePath = path.join(uploadsDir, 'jordan_taylor_resume.pdf');
    fs.writeFileSync(jordanResumePath, 'Jordan Taylor - Frontend Engineer. Skills: React, JavaScript, HTML, CSS, Tailwind CSS, Redux, Next.js, Git, REST API.');

    const jordanResume = await Resume.create({
      candidate: jordanUser._id,
      originalName: 'Jordan_Taylor_Frontend_Resume.pdf',
      fileName: 'jordan_taylor_resume.pdf',
      filePath: jordanResumePath,
      mimeType: 'application/pdf',
      fileSize: 8500,
      extractedText: 'Jordan Taylor - Frontend UI/UX Developer creating high-fidelity responsive user interfaces with React, Tailwind CSS, and Next.js.',
      extractedSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'Next.js', 'Git', 'REST API'],
      parseStatus: 'success',
      analysisMetadata: {
        wordCount: 280,
        detectedEmail: 'jordan.taylor@gmail.com',
        detectedPhone: '+1 (206) 555-9012',
        detectedExperienceYears: 3,
      },
    });

    await CandidateProfile.create({
      user: jordanUser._id,
      headline: 'Frontend Engineer | UI/UX & React Specialist',
      bio: 'Obsessed with fluid micro-interactions, responsive design systems, and web performance.',
      location: 'Seattle, WA',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'Next.js', 'Git', 'REST API'],
      activeResume: jordanResume._id,
      education: [
        {
          school: 'University of Washington',
          degree: 'B.S. in Informatics',
          startYear: 2018,
          endYear: 2022,
        },
      ],
      experience: [
        {
          title: 'Frontend Developer',
          company: 'Starlight Studio',
          location: 'Seattle, WA',
          startDate: new Date('2022-09-01'),
          isCurrent: true,
          description: 'Built customer-facing design components and converted legacy designs to modern Tailwind CSS.',
        },
      ],
      socialLinks: {
        github: 'https://github.com/jordantaylor-ui',
      },
    });

    console.log('🌱 Seeding Job Vacancies...');
    // Job 1: Google - Senior Full-Stack Engineer
    const job1 = await Job.create({
      title: 'Senior Full-Stack Engineer (React & Node.js)',
      recruiter: sarahUser._id,
      company: googleCompany._id,
      category: categories[0]._id,
      description: `Google Cloud is looking for an experienced Senior Full-Stack Engineer to lead the design and implementation of next-generation cloud developer tooling. You will build highly responsive frontends and resilient backend distributed services.\n\nKey Responsibilities:\n• Design, develop, test, and deploy resilient cloud management user experiences.\n• Partner with product managers and UX designers to craft intuitive interfaces.\n• Champion engineering excellence, code reviews, and automated testing.`,
      requirements: `• 4+ years of professional full-stack development experience.\n• High proficiency in JavaScript, TypeScript, React, and Node.js.\n• Experience with RESTful APIs, microservices, and Docker containerization.\n• Solid understanding of cloud infrastructure (GCP or AWS).`,
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
      niceToHaveSkills: ['AWS', 'GCP', 'GraphQL', 'Kubernetes'],
      location: 'Mountain View, CA / Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryMin: 165000,
      salaryMax: 220000,
      salaryCurrency: 'USD',
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      viewsCount: 142,
    });

    // Job 2: Stripe - Machine Learning Research Engineer
    const job2 = await Job.create({
      title: 'Machine Learning Research Engineer',
      recruiter: marcusUser._id,
      company: stripeCompany._id,
      category: categories[1]._id,
      description: `Stripe processes hundreds of billions of dollars each year for millions of businesses worldwide. Our Machine Learning team develops state-of-the-art fraud detection, risk evaluation, and algorithmic pricing systems.\n\nKey Responsibilities:\n• Build and scale deep neural network architectures for real-time transaction risk scoring.\n• Train high-throughput models utilizing PyTorch, Python, and GPU clusters.\n• Collaborate with payments infrastructure engineers to optimize model latency.`,
      requirements: `• MS or PhD in Computer Science, Machine Learning, or related quantitative field.\n• 3+ years experience developing production ML systems using PyTorch or TensorFlow.\n• Strong foundation in algorithms, data structures, and statistics.`,
      requiredSkills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'SQL'],
      niceToHaveSkills: ['Docker', 'Kubernetes', 'Pandas', 'AWS'],
      location: 'San Francisco, CA / Hybrid',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryMin: 175000,
      salaryMax: 240000,
      salaryCurrency: 'USD',
      status: 'active',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      viewsCount: 98,
    });

    // Job 3: Google - Cloud Infrastructure & DevOps Specialist
    const job3 = await Job.create({
      title: 'Cloud Infrastructure & DevOps Engineer',
      recruiter: sarahUser._id,
      company: googleCompany._id,
      category: categories[2]._id,
      description: `Join Google Cloud Core Infrastructure to scale our automated CI/CD pipelines, container orchestration clusters, and platform observability services.`,
      requirements: `• Hands-on mastery of Kubernetes, Docker, Linux, and automated CI/CD.\n• Strong scripting skills in Python, Go, or Bash.\n• Experience with infrastructure-as-code and cloud monitoring.`,
      requiredSkills: ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Git'],
      niceToHaveSkills: ['AWS', 'GCP', 'Python', 'Go'],
      location: 'Seattle, WA / Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      salaryMin: 140000,
      salaryMax: 185000,
      salaryCurrency: 'USD',
      status: 'active',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      viewsCount: 76,
    });

    // Job 4: Stripe - Frontend UI/UX Software Engineer
    const job4 = await Job.create({
      title: 'Frontend UI/UX Software Engineer',
      recruiter: marcusUser._id,
      company: stripeCompany._id,
      category: categories[0]._id,
      description: `Stripe's Dashboard team builds the visual mission control used daily by CFOs and engineers around the globe. We hold a relentlessly high standard for visual craft, typography, accessibility, and speed.`,
      requirements: `• Deep expertise in modern React, JavaScript, HTML, CSS, and Tailwind CSS.\n• Meticulous attention to detail and design system consistency.\n• Experience with state management (Redux) and REST APIs.`,
      requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
      niceToHaveSkills: ['Next.js', 'Redux', 'TypeScript', 'GraphQL'],
      location: 'San Francisco, CA / Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      salaryMin: 135000,
      salaryMax: 180000,
      salaryCurrency: 'USD',
      status: 'active',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      viewsCount: 115,
    });

    console.log('🌱 Seeding Applications & Match Scores...');
    // App 1: Alex Rivers applies to Google Senior Full-Stack Engineer
    const alexMatch = calculateSkillMatch(alexResume.extractedSkills, job1.requiredSkills, job1.niceToHaveSkills);
    const app1 = await Application.create({
      job: job1._id,
      candidate: alexUser._id,
      resume: alexResume._id,
      status: APPLICATION_STATUS.SHORTLISTED,
      coverLetter: 'I am thrilled to apply for the Senior Full-Stack Engineer role at Google. My experience building resilient TypeScript microservices and interactive React dashboards aligns directly with your mission.',
      matchScore: alexMatch.matchScore,
      matchedSkills: alexMatch.matchedSkills,
      missingSkills: alexMatch.missingSkills,
      scoreBreakdown: alexMatch.scoreBreakdown,
      statusHistory: [
        { status: APPLICATION_STATUS.APPLIED, updatedBy: alexUser._id, note: 'Applied online.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { status: APPLICATION_STATUS.UNDER_REVIEW, updatedBy: sarahUser._id, note: 'Profile reviewed by hiring committee.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { status: APPLICATION_STATUS.SHORTLISTED, updatedBy: sarahUser._id, note: 'Candidate invited for technical screening.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      ],
      recruiterNotes: 'Exceptional background in cloud systems and modern React architecture. Strong cultural match.',
    });
    job1.applicantsCount = 1;
    await job1.save();

    // App 2: Priya Sharma applies to Stripe ML Engineer
    const priyaMatch = calculateSkillMatch(priyaResume.extractedSkills, job2.requiredSkills, job2.niceToHaveSkills);
    const app2 = await Application.create({
      job: job2._id,
      candidate: priyaUser._id,
      resume: priyaResume._id,
      status: APPLICATION_STATUS.INTERVIEW_SCHEDULED,
      coverLetter: 'With 4+ years researching deep learning architectures and production model deployment, I am eager to contribute to Stripe’s fraud detection research.',
      matchScore: priyaMatch.matchScore,
      matchedSkills: priyaMatch.matchedSkills,
      missingSkills: priyaMatch.missingSkills,
      scoreBreakdown: priyaMatch.scoreBreakdown,
      statusHistory: [
        { status: APPLICATION_STATUS.APPLIED, updatedBy: priyaUser._id, note: 'Application submitted.', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
        { status: APPLICATION_STATUS.SHORTLISTED, updatedBy: marcusUser._id, note: 'High match on PyTorch and model design.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { status: APPLICATION_STATUS.INTERVIEW_SCHEDULED, updatedBy: marcusUser._id, note: 'Technical interview scheduled.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      ],
      recruiterNotes: 'Impressive Stanford background; verified model training at scale.',
    });
    job2.applicantsCount = 1;
    await job2.save();

    // App 3: Jordan Taylor applies to Stripe Frontend Engineer
    const jordanMatch = calculateSkillMatch(jordanResume.extractedSkills, job4.requiredSkills, job4.niceToHaveSkills);
    const app3 = await Application.create({
      job: job4._id,
      candidate: jordanUser._id,
      resume: jordanResume._id,
      status: APPLICATION_STATUS.OFFERED,
      coverLetter: 'Stripe’s interface design has always been the gold standard for my development journey. I would love to build next-gen dashboard experiences.',
      matchScore: jordanMatch.matchScore,
      matchedSkills: jordanMatch.matchedSkills,
      missingSkills: jordanMatch.missingSkills,
      scoreBreakdown: jordanMatch.scoreBreakdown,
      statusHistory: [
        { status: APPLICATION_STATUS.APPLIED, updatedBy: jordanUser._id, note: 'Applied online.', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { status: APPLICATION_STATUS.INTERVIEW_SCHEDULED, updatedBy: marcusUser._id, note: 'Panel interview completed.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { status: APPLICATION_STATUS.OFFERED, updatedBy: marcusUser._id, note: 'Formal offer extended.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      ],
      recruiterNotes: 'Phenomenal design sensibility and speed during the live coding challenge.',
    });
    job4.applicantsCount = 1;
    await job4.save();

    console.log('🌱 Seeding Interviews...');
    const interviewDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    interviewDate.setHours(14, 0, 0, 0);

    await Interview.create({
      application: app2._id,
      job: job2._id,
      candidate: priyaUser._id,
      recruiter: marcusUser._id,
      title: 'Technical ML Deep Dive & Architecture Challenge',
      scheduledDate: interviewDate,
      startTime: '14:00',
      endTime: '15:00',
      type: 'online',
      meetingLink: 'https://meet.google.com/xyz-recruitiq-demo',
      recruiterNotes: 'Prepare to discuss transformer architectures, latency constraints, and feature engineering.',
      status: 'scheduled',
    });

    console.log('🌱 Seeding Notifications...');
    await Notification.create([
      {
        recipient: priyaUser._id,
        title: 'Interview Scheduled',
        message: 'Your technical interview for Machine Learning Research Engineer at Stripe has been scheduled for this week.',
        type: 'interview_scheduled',
        link: '/candidate/interviews',
      },
      {
        recipient: alexUser._id,
        title: 'Application Shortlisted',
        message: 'Congratulations! Your application for Senior Full-Stack Engineer at Google has been shortlisted.',
        type: 'application_status',
        link: `/candidate/applications/${app1._id}`,
      },
      {
        recipient: sarahUser._id,
        title: 'New Applicant Match',
        message: 'Alex Rivers applied for Senior Full-Stack Engineer with a 100% skill match score.',
        type: 'application_status',
        link: `/recruiter/applications?jobId=${job1._id}`,
      },
    ]);

    console.log('🌱 Seeding Audit Logs...');
    await AuditLog.create([
      {
        user: admin._id,
        action: 'SYSTEM_INITIALIZED',
        resource: 'Platform',
        details: { message: 'RecruitIQ platform seeded with realistic production-ready data.' },
      },
      {
        user: sarahUser._id,
        action: 'JOB_CREATED',
        resource: 'Job',
        resourceId: String(job1._id),
        details: { title: job1.title },
      },
      {
        user: marcusUser._id,
        action: 'INTERVIEW_SCHEDULED',
        resource: 'Interview',
        details: { candidate: priyaUser.name, job: job2.title },
      },
    ]);

    console.log('\n======================================================');
    console.log('🎉 RECRUITIQ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Demo Credentials for Instant Testing:');
    console.log('------------------------------------------------------');
    console.log('👤 ADMIN:');
    console.log('   Email:    admin@recruitiq.com');
    console.log('   Password: Admin@123456');
    console.log('');
    console.log('👔 RECRUITERS:');
    console.log('   Email:    recruiter@google.com');
    console.log('   Email:    recruiter@stripe.com');
    console.log('   Password: Password@123');
    console.log('');
    console.log('💼 CANDIDATES:');
    console.log('   Email:    alex.rivers@gmail.com  (Senior Full Stack)');
    console.log('   Email:    priya.sharma@gmail.com (AI/ML Engineer)');
    console.log('   Email:    jordan.taylor@gmail.com (Frontend Engineer)');
    console.log('   Password: Password@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

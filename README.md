# RecruitIQ — AI Recruitment & Talent Management System

> **A real-world recruitment platform connecting Job Seekers, Recruiters, and Administrators with explainable skill-matching algorithms, automated resume screening, and comprehensive talent management pipelines.**

Designed and implemented as a capstone engineering project featuring a modern **MERN (MongoDB, Express, React, Node.js)** architecture styled with **Google Antigravity dark cosmic aesthetic**, responsive glassmorphic interfaces, and deterministic, ethical human-in-the-loop decision support.

---

## 1. Project Overview

RecruitIQ addresses the critical modern hiring challenge: manual resume screening is slow, error-prone, and susceptible to cognitive fatigue, while black-box AI algorithms introduce opaque biases. 

RecruitIQ provides:
- **Transparent, Explainable Skill Matching**: A deterministic algorithm calculating mathematical match percentages between verified candidate capabilities and job requirements.
- **Automated Document Text Extraction**: Instant parsing of PDF and DOCX resume uploads with multi-category token boundary matching that prevents false-positive substrings.
- **Pluggable AI Intelligence**: Modular architecture supporting Google Gemini API with seamless offline fallback to a local rule-based analytical engine.
- **Full-Cycle Recruitment Pipeline**: Transparent transitions across 8 stages (*Applied*, *Under Review*, *Shortlisted*, *Interview Scheduled*, *Offered*, *Hired*, *Rejected*, *Withdrawn*) with auditable history logs and candidate notification alerts.
- **Real Database-Backed Analytics**: Live Recharts dashboards visualizing conversion funnels, monthly applicant trends, and stage distributions without hardcoded values.

---

## 2. Key Features by User Role

### A. Candidate / Job Seeker
- **Authentication & Secure Profile**: JWT token-based sessions with password hashing (bcryptjs).
- **Resume Vault**: Upload PDF or DOCX resumes; automatic text extraction identifies programming languages, frameworks, databases, and DevOps tools.
- **Explainable Job Matching**: View transparent score breakdowns, matched skills, missing skills, and detailed compatibility explanations.
- **AI Job Recommendations**: Real-time algorithmic ranking of open positions based on candidate's verified skills.
- **Application Tracker**: Monitor submitted applications across hiring stages with timeline logs and withdrawal capability.
- **Interview Hub**: Access scheduled video meeting links, onsite office details, and interviewer notes.

### B. Recruiter
- **Company & Recruiter Branding**: Manage company profile, industry classification, size, and website.
- **Vacancy Lifecycle**: Publish, update, close, and soft-delete job postings with required and nice-to-have skill definitions.
- **Applicant Review Pool**: Filter applicants by job vacancy and recruitment stage; sort by algorithmic match score.
- **AI Resume Screening Intelligence**: Inspect executive summaries, candidate strengths, growth areas, and suggested technical interview questions.
- **Interview Scheduling**: Schedule video calls or onsite rounds with date/time selectors, meeting links, and automated in-app candidate notifications.
- **Recruitment Analytics**: Visualize applicant distribution and pipeline stages using responsive Recharts graphs.

### C. Administrator
- **Platform Analytics**: Global counts of registered users, active vacancies, applications, and hiring conversions.
- **User Directory**: Search candidates and recruiters; toggle account activation status to suspend or reactivate users.
- **Job Oversight & Moderation**: Audit all published listings across all companies; remove inappropriate or violating vacancies.
- **Category Taxonomy Manager**: Create, edit, and categorize job domains with live job count badges.
- **Audit Logs Trail**: Real-time security stream recording authentications, job modifications, and stage transitions with IP addresses and user agents.

---

## 3. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18 & Vite | Fast HMR, component modularity, production tree-shaking |
| **Styling & Icons** | Tailwind CSS & Lucide Icons | Google Antigravity dark obsidian design system, glassmorphism |
| **Visualizations** | Recharts | Dynamic responsive funnel, bar, line, and pie charts |
| **Routing & Client State**| React Router 6 & Context API | Centralized Auth & Notification providers, protected route guards |
| **Backend Framework** | Node.js & Express.js | ES Modules, REST API architecture, centralized error handling |
| **Database & ODM** | MongoDB & Mongoose 8 | 11 collections, schema validation, compound unique indexes |
| **Document Extraction** | pdf-parse & mammoth | Native PDF & DOCX raw text parsing with UUID file security |
| **Security & Auth** | JWT, bcryptjs, Helmet, CORS | Secure HTTP cookies, authorization middleware, input sanitization |
| **Validation** | express-validator | Strict request payload validation |
| **Testing** | Vitest & Supertest | Automated unit and integration test suite |

---

## 4. Default Seed Credentials (1-Click Test Drive)

The system includes a development seed script preloading realistic tech companies, vacancies, candidates, resumes, applications, and interviews:

| Role | Email | Password | Details |
|---|---|---|---|
| **System Admin** | `admin@recruitiq.com` | `Admin@123456` | Full platform oversight & audit trail |
| **Google Recruiter** | `recruiter@google.com` | `Password@123` | Staff Technical Recruiter (Sarah Chen) |
| **Stripe Recruiter** | `recruiter@stripe.com` | `Password@123` | Head of Talent (Marcus Vance) |
| **Candidate (Senior)** | `alex.rivers@gmail.com` | `Password@123` | Senior Full-Stack Engineer (5+ yrs, React/Node) |
| **Candidate (AI/ML)** | `priya.sharma@gmail.com` | `Password@123` | Machine Learning Engineer (PyTorch/Python) |
| **Candidate (UI/UX)** | `jordan.taylor@gmail.com` | `Password@123` | Frontend UI Engineer (React/Tailwind) |

*The login page also provides 1-click test buttons to populate credentials instantly.*

---

## 5. Prerequisites

Before running the application, ensure your environment has:
1. **Node.js**: `v18.0.0` or higher (Recommended: `v20.x` or `v24.x`)
2. **npm**: `v9.0.0` or higher
3. **MongoDB**: Local MongoDB instance listening on port `27017` **OR** a MongoDB Atlas connection URI.

---

## 6. Environment Configuration

### Backend: `server/.env`
Create or modify `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/recruitiq
JWT_SECRET=recruitiq_super_secure_jwt_secret_key_2026_xyz987
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@recruitiq.com
ADMIN_PASSWORD=Admin@123456
MAX_FILE_SIZE=5242880
# Optional external AI key (e.g. Google Gemini API)
GEMINI_API_KEY=
```

### Frontend: `client/.env`
Create or modify `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Installation & Setup Instructions

### Step 1: Install Dependencies
From the project root:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```
*(Or install separately: `cd server && npm install`, then `cd ../client && npm install`)*

### Step 2: Seed the Database
Populate the database with realistic sample companies, jobs, resumes, and candidate pipelines:
```bash
npm run seed
```

### Step 3: Start the Application
Run both backend API and frontend dev server concurrently:
```bash
npm run dev
```

Alternatively, start them in separate terminals:
- **Backend API**: `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend Client**: `cd client && npm run dev` (Runs on `http://localhost:5173`)

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 8. Running Automated Tests

Run the backend test suite with Vitest and Supertest:
```bash
npm test
```
The test suite validates:
1. **Deterministic Skill Match Calculation**: Evaluates match ratios, formula bounds, and zero-division protection.
2. **Regex Substring False-Positive Prevention**: Confirms "C" does not match "CSS", and "Java" does not match "JavaScript".
3. **Resume Text & Email Extraction**: Verifies metadata parser resilience.
4. **Candidate & Recruiter Registration**: Checks 201 Created responses and linked company creation.
5. **Duplicate Application Prevention**: Confirms compound index prevents duplicate submissions (HTTP 409 Conflict).
6. **Role-Based Access Control**: Ensures candidates cannot post jobs (HTTP 403 Forbidden).
7. **Job Search & Pagination**: Verifies query filtering and health check endpoints.

---

## 9. Production Build

To produce an optimized production bundle:
```bash
npm run build
```
This runs Vite's build pipeline, generating minified assets in `client/dist/`.

---

## 10. API Documentation Summary

### Authentication (`/api/auth`)
- `POST /register/candidate` - Register candidate account & profile
- `POST /register/recruiter` - Register recruiter account & company
- `POST /login` - User login & JWT issuance
- `POST /logout` - Invalidate session cookie
- `GET /me` - Retrieve authenticated user & profile

### Job Vacancies (`/api/jobs`)
- `GET /` - Search & filter vacancies (pagination, salary, location, skills)
- `GET /:id` - Retrieve single job vacancy & increment views
- `GET /recruiter/my-jobs` - Recruiter's published listings
- `POST /` - Create new vacancy (Recruiter only)
- `PUT /:id` - Update vacancy (Owner or Admin)
- `PATCH /:id/status` - Toggle active/closed status
- `DELETE /:id` - Soft delete vacancy

### Applications (`/api/applications`)
- `POST /apply` - Submit application (checks duplicates, auto-calculates match)
- `GET /job/:jobId` - Review applicants for a specific job (Recruiter)
- `GET /recruiter/all` - All applicants across recruiter's jobs
- `GET /:id` - Application details & status history timeline
- `PATCH /:id/status` - Transition recruitment stage & notify candidate
- `POST /:id/withdraw` - Withdraw active application (Candidate)

### Resumes & AI Screening (`/api/resumes`, `/api/matching`)
- `POST /resumes/upload` - Secure multipart upload (PDF/DOCX), parse & extract skills
- `GET /resumes/my-resumes` - List candidate's vault resumes
- `GET /resumes/:id/download` - Authorized file download
- `GET /matching/job/:jobId` - Explainable match score between candidate & job
- `GET /matching/recommendations` - Ranked job recommendations for candidate
- `GET /matching/application/:id/ai-insights` - AI executive summary & suggested questions

### Interviews (`/api/interviews`)
- `POST /` - Schedule interview (Candidate notified)
- `GET /recruiter` - Recruiter's interview schedule
- `GET /candidate` - Candidate's interview schedule
- `PATCH /:id` - Complete, reschedule, or cancel interview

### Administration & Analytics (`/api/admin`, `/api/analytics`)
- `GET /admin/users` - User directory with activation toggles
- `PATCH /admin/users/:id/status` - Activate or deactivate user
- `GET /admin/jobs` - Global job moderation
- `GET /admin/categories` - Category taxonomy manager
- `GET /admin/audit-logs` - Platform security audit trail
- `GET /analytics/admin` - Global pipeline funnel & metrics
- `GET /analytics/recruiter` - Recruiter application stats
- `GET /analytics/candidate` - Candidate applications & match averages

---

## 11. Security Implementation

1. **Password Hashing**: Salted bcrypt password hashes (cost factor 10). Passwords are excluded from query returns by default (`select: false`).
2. **Role-Based Authorization**: Backend middleware strictly checks permissions (`authorize('recruiter')`, `authorize('admin')`). Route protection is never left solely to frontend navigation.
3. **Safe File Uploads**: Multer assigns random UUID filenames to prevent path traversal and file overwriting. Mime types and file extensions are checked against PDF and DOCX whitelists.
4. **Private Resume Access**: Resumes are protected by authorization checks. Only the candidate who uploaded it, recruiters reviewing an application from that candidate, or system administrators can view or download resumes.
5. **Duplicate Prevention**: Compound MongoDB unique index `{ job: 1, candidate: 1 }` prevents concurrent or duplicate applications.
6. **Defense in Depth**: Helmet security headers, CORS origin restrictions, input sanitation via `express-validator`, and audit logging of all sensitive administrative and recruitment actions.

---

## 12. Troubleshooting

- **MongoDB Connection Error**:
  Ensure MongoDB service is running locally (`mongod` on port 27017) or specify an Atlas URI in `server/.env`.
- **EPERM on Windows Build**:
  Ensure no background process has locked `client/dist`. Run `mkdir client/dist/assets` or build with elevated permissions.
- **Port Conflict (5000 or 5173)**:
  Change `PORT` in `server/.env` and update `VITE_API_URL` in `client/.env` accordingly.

---

## 13. License

Developed for academic engineering project demonstration. Released under the MIT License.

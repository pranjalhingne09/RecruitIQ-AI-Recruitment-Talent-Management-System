import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Cpu,
  Shield,
  Layers,
  Database,
  Code2,
  FileText,
  Workflow,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="cyan" size="sm">
          System Architecture
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk']">
          Recruit<span className="text-gradient-primary">IQ</span> Platform Design
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Engineering design and algorithmic specifications for the AI-Assisted Recruitment and Talent Management System.
        </p>
      </div>

      {/* Technology Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Frontend Presentation</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Modern Single Page Application built with React 18 and Vite for rapid HMR. Styled with Tailwind CSS following Google Antigravity dark obsidian aesthetics with Lucide React icons and Recharts data visualizations.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['React 18', 'Vite', 'Tailwind CSS', 'Recharts', 'React Router 6'].map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Backend REST API</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Node.js and Express.js ES Module server implementing robust RESTful endpoints with JWT session authentication, role-based access control, Multer multipart streaming, and centralized error handling.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Node.js', 'Express.js', 'JWT', 'Multer', 'pdf-parse', 'mammoth'].map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Database & Storage</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            MongoDB with Mongoose ODM modeling 11 interconnected collections: Users, Profiles, Companies, Jobs, Resumes, Applications, Interviews, Categories, Notifications, and Audit Logs with compound unique indexes.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['MongoDB', 'Mongoose ODM', 'UUID V4', 'Compound Indexes'].map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Matching Algorithm Specification */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Explainable Matching Algorithm</h2>
            <p className="text-xs text-slate-400">Deterministic mathematical scoring with zero black-box bias</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed mt-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-indigo-400">Mathematical Formulation</h4>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800">
              Skill Match Score = (Matched Required Skills / Total Required Skills) × 100
            </div>
            <p className="text-slate-400 pt-1">
              Zero-division protection: When a vacancy specifies zero mandatory skills, base score defaults safely to 100%. An additional weighted bonus is granted for matching optional nice-to-have competencies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-indigo-400">Token-Based Skill Extraction</h4>
            <p className="text-slate-400">
              Over 300 categorized skills across Programming, Frontend, Backend, Databases, Cloud, DevOps, and Data Science. Regex matchers incorporate negative lookaheads to strictly prevent false substring matches (e.g., verifying that "C" does not falsely trigger on "CSS" or "Cascading").
            </p>
          </div>
        </div>
      </Card>

      {/* Ethical AI Commitment */}
      <Card className="p-8 bg-gradient-to-r from-indigo-950/20 to-slate-900/60 border-indigo-500/20">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Ethical Human-in-the-Loop Decision Support</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          RecruitIQ is built upon the strict ethical principle that algorithmic scores serve solely as decision support tools for human recruiters. Match percentages do not represent hiring probabilities, do not assess protected traits, and cannot automatically reject candidates without human review.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Recruiter final authority</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Audited status transitions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Transparent explanation breakdowns</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

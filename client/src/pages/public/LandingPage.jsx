import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { formatSalaryRange } from '../../utils/formatters';
import {
  ArrowRight,
  Shield,
  Cpu,
  CheckCircle2,
  Users,
  Briefcase,
  Search,
  FileCheck,
  TrendingUp,
  Brain,
  Zap,
  Building,
  MapPin,
  DollarSign,
} from 'lucide-react';

export const LandingPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getJobs({ limit: 4 });
        if (res.success && res.data) {
          setFeaturedJobs(res.data);
        }
      } catch (err) {
        console.warn('Failed to load featured vacancies:', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleQuickLogin = async (email, password) => {
    try {
      await login({ email, password });
      navigate('/jobs');
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Cosmic background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-3/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Antigravity floating pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-pulse-subtle shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation AI Recruitment & Talent Management</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] font-['Space_Grotesk']">
          Recruitment made <span className="text-gradient-primary">intelligent</span>,{' '}
          transparent & <span className="text-gradient-purple">explainable</span>.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          RecruitIQ empowers recruiters with algorithmic resume screening, skill gap breakdowns, and automated interview workflows, while giving candidates transparent feedback and personalized job matches.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/jobs">
            <Button variant="primary" size="lg" icon={Search}>
              Explore Open Positions
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="secondary" size="lg">
              Explore Architecture
            </Button>
          </Link>
        </div>

        {/* Demo Fast-Track Evaluation Banner */}
        <div className="mt-14 max-w-4xl mx-auto p-5 rounded-2xl glass-panel-elevated border border-slate-800 text-left">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              1-Click Instant Evaluator Test Drive (Preloaded Demonstration Data)
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Zero manual typing required
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleQuickLogin('admin@recruitiq.com', 'Admin@123456')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
            >
              <div className="text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300">
                Admin Console
              </div>
              <div className="text-[10px] text-slate-400 truncate">admin@recruitiq.com</div>
            </button>

            <button
              onClick={() => handleQuickLogin('recruiter@google.com', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
            >
              <div className="text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300">
                Google Recruiter
              </div>
              <div className="text-[10px] text-slate-400 truncate">recruiter@google.com</div>
            </button>

            <button
              onClick={() => handleQuickLogin('recruiter@stripe.com', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 transition-all text-left group"
            >
              <div className="text-[11px] font-bold text-purple-400 group-hover:text-purple-300">
                Stripe Recruiter
              </div>
              <div className="text-[10px] text-slate-400 truncate">recruiter@stripe.com</div>
            </button>

            <button
              onClick={() => handleQuickLogin('alex.rivers@gmail.com', 'Password@123')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
            >
              <div className="text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">
                Candidate Alex
              </div>
              <div className="text-[10px] text-slate-400 truncate">alex.rivers@gmail.com</div>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="cyan" size="sm">
            Core Capabilities
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 font-['Space_Grotesk']">
            Engineered for Modern Talent Acquisition
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Eliminating black-box recruiting decisions with mathematically explainable scoring and structured candidate workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Automated Resume Extraction
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts text from PDF and DOCX documents with robust token parsing, identifying programming languages, cloud platforms, and engineering methodologies without false substring matches.
            </p>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Explainable Job Matching
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent skill matching score: computes matched required skills, identifies missing competencies, and provides an audited mathematical breakdown to support human recruiters.
            </p>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Pluggable AI Architecture
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modular service architecture that utilizes Google Gemini API when configured, with a zero-cost local rule-based analytical engine fallback that operates completely offline.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
              Featured Job Openings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live vacancies with transparent skill requirements
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" size="sm" icon={ArrowRight}>
              View All Positions
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredJobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`}>
              <Card className="p-5 hover:border-indigo-500/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {job.company?.name || 'Top Tech Firm'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant="cyan" size="xs">
                    {job.employmentType}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.requiredSkills?.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills?.length > 4 && (
                    <span className="text-[10px] text-slate-500 self-center">
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400">
                    {formatSalaryRange(job.salaryMin, job.salaryMax)}
                  </span>
                  <span className="text-indigo-400 flex items-center gap-1 font-medium">
                    Apply Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

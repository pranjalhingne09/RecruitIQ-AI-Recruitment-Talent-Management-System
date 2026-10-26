import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { matchingService } from '../../services/matchingService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { JobApplyModal } from '../../components/jobs/JobApplyModal';
import { SkillMatchBadge } from '../../components/resumes/SkillMatchBadge';
import { formatSalaryRange } from '../../utils/formatters';
import {
  MapPin,
  Building,
  DollarSign,
  Briefcase,
  Calendar,
  Eye,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await jobService.getJobById(id);
        if (res.success && res.data) {
          setJob(res.data);
        }
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, navigate]);

  useEffect(() => {
    const fetchMatch = async () => {
      if (isAuthenticated && user?.role === 'candidate' && id) {
        try {
          const res = await matchingService.getJobMatch(id);
          if (res.success && res.data) {
            setMatchData(res.data);
          }
        } catch (err) {
          // Ignored
        }
      }
    };
    fetchMatch();
  }, [isAuthenticated, user, id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
        <LoadingSkeleton count={3} height="h-40" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vacancies
        </Link>
      </div>

      {/* Hero Banner Card */}
      <Card className="p-8 relative overflow-hidden" elevated>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan" size="sm">
                {job.employmentType}
              </Badge>
              <Badge variant="purple" size="sm">
                {job.experienceLevel} Level
              </Badge>
              {job.category?.name && (
                <Badge variant="default" size="sm">
                  {job.category.name}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Building className="w-4 h-4 text-slate-400" />
                {job.company?.name || 'Company'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location}
              </span>
              {job.salaryMax > 0 && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">
                    {formatSalaryRange(job.salaryMin, job.salaryMax)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {job.applicantsCount || 0} applicants
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {job.viewsCount || 0} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-3 shrink-0">
            {isAuthenticated && user?.role === 'candidate' ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsApplyModalOpen(true)}
                disabled={alreadyApplied}
                className="w-full"
              >
                {alreadyApplied ? 'Applied' : 'Apply for Position'}
              </Button>
            ) : isAuthenticated && user?.role === 'recruiter' ? (
              <span className="text-xs text-slate-400 italic">Recruiter Mode</span>
            ) : (
              <Link to="/login" className="w-full">
                <Button variant="primary" size="md" className="w-full">
                  Sign in to Apply
                </Button>
              </Link>
            )}

            <Button variant="secondary" size="md" onClick={handleShare} icon={Share2} className="w-full">
              Share
            </Button>
          </div>
        </div>
      </Card>

      {/* Candidate AI Skill Compatibility Breakdown (If logged in as candidate) */}
      {matchData && (
        <Card className="p-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30 border-indigo-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Your AI Job Match Compatibility
              </h3>
            </div>
            <SkillMatchBadge score={matchData.matchScore} size="lg" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {matchData.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1.5">
                Matched Required Skills ({matchData.matchedSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchData.matchedSkills?.length > 0 ? (
                  matchData.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">None matched</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1.5">
                Missing Required Skills ({matchData.missingSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchData.missingSkills?.length > 0 ? (
                  matchData.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    >
                      ✗ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> You have all required skills!
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Role Overview & Description
            </h2>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </Card>

          {/* Requirements */}
          {job.requirements && (
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                Qualifications & Requirements
              </h2>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </Card>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                Key Responsibilities
              </h2>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* Skills Required Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Required Core Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills?.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {job.niceToHaveSkills?.length > 0 && (
              <>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider pt-2">
                  Preferred / Nice-to-Have
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.niceToHaveSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-400 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Company Card */}
          {job.company && (
            <Card className="p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                About the Company
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-sm">
                  {job.company.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{job.company.name}</h4>
                  <p className="text-xs text-slate-400">{job.company.industry}</p>
                </div>
              </div>
              {job.company.description && (
                <p className="text-xs text-slate-400 leading-relaxed">
                  {job.company.description}
                </p>
              )}
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium pt-1"
                >
                  <Globe className="w-3.5 h-3.5" /> Visit Company Website
                </a>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <JobApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onApplied={() => setAlreadyApplied(true)}
      />
    </div>
  );
};

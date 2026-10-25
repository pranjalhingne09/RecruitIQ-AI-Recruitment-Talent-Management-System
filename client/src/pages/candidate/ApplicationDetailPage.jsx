import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/applications/StatusBadge';
import { SkillMatchBadge } from '../../components/resumes/SkillMatchBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';

export const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await applicationService.getApplicationById(id);
        if (res.success && res.data) {
          setData(res.data.application);
        }
      } catch (err) {
        console.warn('Failed to load application details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton count={3} height="h-32" />;
  }

  if (!data) {
    return <div className="text-center py-12 text-slate-400">Application not found.</div>;
  }

  const pipelineStages = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW_SCHEDULED', label: 'Interview' },
    { key: 'OFFERED', label: 'Offer' },
    { key: 'HIRED', label: 'Hired' },
  ];

  const currentStageIndex = pipelineStages.findIndex((s) => s.key === data.status);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link
          to="/candidate/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Applications
        </Link>
      </div>

      {/* Header Card */}
      <Card className="p-6" elevated>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={data.status} size="sm" />
              <SkillMatchBadge score={data.matchScore} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
              {data.job?.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="text-slate-300 font-semibold">{data.job?.company?.name}</span>
              <span>•</span>
              <span>{data.job?.location}</span>
              <span>•</span>
              <span>Submitted {new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <Link to={`/jobs/${data.job?._id}`}>
            <Button variant="outline" size="sm">
              View Vacancy
            </Button>
          </Link>
        </div>

        {/* Visual Progress Stepper */}
        {data.status !== 'REJECTED' && data.status !== 'WITHDRAWN' && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="grid grid-cols-6 gap-2 text-center">
              {pipelineStages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="space-y-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCurrent
                          ? 'bg-cyan-400 shadow-md shadow-cyan-400/50'
                          : isPassed
                          ? 'bg-indigo-500'
                          : 'bg-slate-800'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-semibold block ${
                        isCurrent ? 'text-cyan-400' : isPassed ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Status History Timeline */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          Application Progress Timeline
        </h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
          {data.statusHistory?.map((item, idx) => (
            <div key={idx} className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-slate-900 shadow-sm" />
              <div className="flex-1 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">
                    Stage changed to: <strong className="text-indigo-400">{item.status.replace('_', ' ')}</strong>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                {item.note && (
                  <p className="text-xs text-slate-400 leading-relaxed">{item.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Match Breakdown */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Explainable Skill Match Analysis
          </h3>
          <span className="text-xs font-bold text-cyan-400">{data.matchScore}% Score</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {data.scoreBreakdown?.formulaExplanation || 'Calculated using verified candidate skills against required skills.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1.5">
              Matched Skills ({data.matchedSkills?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.matchedSkills?.map((s) => (
                <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1.5">
              Missing Skills ({data.missingSkills?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.missingSkills?.length > 0 ? (
                data.missingSkills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    ✗ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400">All mandatory skills matched!</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Cover Letter */}
      {data.coverLetter && (
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Submitted Cover Letter
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {data.coverLetter}
          </p>
        </Card>
      )}
    </div>
  );
};

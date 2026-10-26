import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchingService } from '../../services/matchingService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SkillMatchBadge } from '../../components/resumes/SkillMatchBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { JobApplyModal } from '../../components/jobs/JobApplyModal';
import { formatSalaryRange } from '../../utils/formatters';
import {
  Sparkles,
  MapPin,
  Building,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

export const RecommendedJobsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [candidateSkillsCount, setCandidateSkillsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await matchingService.getRecommendedJobs();
      if (res.success && res.data) {
        setRecommendations(res.data.recommendations || []);
        setCandidateSkillsCount(res.data.candidateSkillsCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load recommended jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Explainable AI Skill Matching
          </div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Personalized Job Recommendations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vacancies ranked deterministically by comparing your verified skills against each job's required competencies.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">
            Candidate Skills Profile
          </span>
          <span className="font-bold text-indigo-400">{candidateSkillsCount} skills indexed</span>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-44" />
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No active recommendations found"
          description="Make sure you have skills saved on your candidate profile or have uploaded your resume to get scored job matches."
        />
      ) : (
        <div className="space-y-4">
          {recommendations.map((item) => (
            <Card key={item.job._id} className="p-6 space-y-4 hover:border-indigo-500/40">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                      <Link to={`/jobs/${item.job._id}`}>{item.job.title}</Link>
                    </h3>
                    <Badge variant="cyan" size="xs">
                      {item.job.employmentType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">
                      {item.job.company?.name || 'Top Tech Firm'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {item.job.location}
                    </span>
                    {item.job.salaryMax > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">
                          {formatSalaryRange(item.job.salaryMin, item.job.salaryMax)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <SkillMatchBadge score={item.matchScore} size="lg" />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedJobForApply(item.job)}
                  >
                    Quick Apply
                  </Button>
                </div>
              </div>

              {/* Explainable Match Narrative */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-indigo-400">Match Analysis: </span>
                {item.explanation}
              </div>

              {/* Skills Breakdown Tags */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1.5">
                    Matched Required Skills ({item.matchedSkills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.matchedSkills?.length > 0 ? (
                      item.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                        >
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1.5">
                    Missing Required Skills ({item.missingSkills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.missingSkills?.length > 0 ? (
                      item.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20"
                        >
                          ✗ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All skills matched!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedJobForApply && (
        <JobApplyModal
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          job={selectedJobForApply}
          onApplied={() => {
            fetchRecommendations();
          }}
        />
      )}
    </div>
  );
};

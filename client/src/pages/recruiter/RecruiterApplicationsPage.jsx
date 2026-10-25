import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/applications/StatusBadge';
import { SkillMatchBadge } from '../../components/resumes/SkillMatchBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusUpdateModal } from '../../components/applications/StatusUpdateModal';
import { ScheduleInterviewModal } from '../../components/interviews/ScheduleInterviewModal';
import { AiInsightsModal } from '../../components/resumes/AiInsightsModal';
import {
  Users,
  Search,
  Filter,
  Sparkles,
  Calendar,
  FileText,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const RecruiterApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedAppForStatus, setSelectedAppForStatus] = useState(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [selectedAppForAi, setSelectedAppForAi] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getRecruiterAllApplications({
        jobId: selectedJobId || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });

      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobsList = async () => {
      try {
        const res = await jobService.getRecruiterJobs();
        if (res.success && res.data) {
          setJobs(res.data);
        }
      } catch (err) {
        // Ignored
      }
    };
    fetchJobsList();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId, selectedStatus]);

  // Client-side search filtering by candidate name or email
  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = app.candidate?.name?.toLowerCase() || '';
    const email = app.candidate?.email?.toLowerCase() || '';
    const jobTitle = app.job?.title?.toLowerCase() || '';
    return name.includes(q) || email.includes(q) || jobTitle.includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Candidate Applicant Review Pool
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate candidate submissions, inspect algorithmic match scores, and transition stages
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Job Filter */}
          <div className="text-xs">
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setSearchParams(e.target.value ? { jobId: e.target.value } : {});
              }}
              className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Job Vacancies</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="OFFERED">Offer Extended</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </Card>

      {/* Applications Table */}
      {loading ? (
        <LoadingSkeleton count={4} height="h-28" />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidate applications found"
          description="Try broadening your job vacancy or status filter criteria."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Applied Vacancy</th>
                  <th className="py-3 px-4">Skill Match Alignment</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{app.candidate?.name}</div>
                      <div className="text-[11px] text-slate-400">{app.candidate?.email}</div>
                      {app.candidate?.phone && (
                        <div className="text-[10px] text-slate-500">{app.candidate.phone}</div>
                      )}
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-300">
                      {app.job?.title}
                    </td>

                    <td className="py-4 px-4 space-y-1.5">
                      <SkillMatchBadge score={app.matchScore} size="sm" />
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.matchedSkills?.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          >
                            ✓ {s}
                          </span>
                        ))}
                        {app.missingSkills?.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Missing: {app.missingSkills[0]}
                            {app.missingSkills.length > 1 ? ` +${app.missingSkills.length - 1}` : ''}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={app.status} size="xs" />
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedAppForAi(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                        title="View AI Screening Insights"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> AI
                      </button>

                      <button
                        onClick={() => setSelectedAppForStatus(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs transition-colors"
                      >
                        Status
                      </button>

                      <button
                        onClick={() => setSelectedAppForInterview(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      {selectedAppForStatus && (
        <StatusUpdateModal
          isOpen={!!selectedAppForStatus}
          onClose={() => setSelectedAppForStatus(null)}
          application={selectedAppForStatus}
          onUpdated={() => fetchApplications()}
        />
      )}

      {selectedAppForInterview && (
        <ScheduleInterviewModal
          isOpen={!!selectedAppForInterview}
          onClose={() => setSelectedAppForInterview(null)}
          application={selectedAppForInterview}
          onScheduled={() => fetchApplications()}
        />
      )}

      {selectedAppForAi && (
        <AiInsightsModal
          isOpen={!!selectedAppForAi}
          onClose={() => setSelectedAppForAi(null)}
          applicationId={selectedAppForAi._id}
          candidateName={selectedAppForAi.candidate?.name}
        />
      )}
    </div>
  );
};

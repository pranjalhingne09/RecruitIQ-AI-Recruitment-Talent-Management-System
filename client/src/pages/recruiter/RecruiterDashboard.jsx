import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/applications/StatusBadge';
import { SkillMatchBadge } from '../../components/resumes/SkillMatchBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { StatusUpdateModal } from '../../components/applications/StatusUpdateModal';
import { ScheduleInterviewModal } from '../../components/interviews/ScheduleInterviewModal';
import { AiInsightsModal } from '../../components/resumes/AiInsightsModal';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Trophy,
  PlusCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedAppForStatus, setSelectedAppForStatus] = useState(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [selectedAppForAi, setSelectedAppForAi] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getRecruiterAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Recruiter analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={3} height="h-32" />;
  }

  const metrics = data?.metrics || {};
  const statusDistribution = data?.statusDistribution || [];
  const jobDistribution = data?.jobDistribution || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            Recruiting Operations
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
            Talent Pipeline Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time candidate metrics, resume screening funnels, and scheduled interviews
          </p>
        </div>

        <Link to="/recruiter/jobs/create">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Publish New Vacancy
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Active Vacancies"
          value={metrics.activeJobs || 0}
          subtitle={`${metrics.totalJobs || 0} total posted`}
          icon={Briefcase}
          iconColor="text-indigo-400"
        />
        <StatCard
          title="Total Applicants"
          value={metrics.totalApplications || 0}
          subtitle="Across all postings"
          icon={Users}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Awaiting Review"
          value={metrics.awaitingReview || 0}
          subtitle="Action required"
          icon={Clock}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Hired"
          value={metrics.hired || 0}
          subtitle="Successful placements"
          icon={Trophy}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applicants by Job Bar Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Applicants by Vacancy
              </h3>
              <p className="text-[11px] text-slate-400">Application volume per job posting</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {jobDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No job applicant data recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="applicants" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Pipeline Distribution Pie Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Candidate Stage Funnel
              </h3>
              <p className="text-[11px] text-slate-400">Current status distribution of applicants</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {statusDistribution.length === 0 ? (
              <div className="text-xs text-slate-500">No applicant statuses to display.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Applicants Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            Recent Applicants & AI Match Scores
          </h2>
          <Link
            to="/recruiter/applications"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Open Candidate Pool →
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">AI Skill Match</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(!data?.recentApplicants || data.recentApplicants.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No candidate applications received yet.
                    </td>
                  </tr>
                ) : (
                  data.recentApplicants.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{app.candidate?.name}</div>
                        <div className="text-[11px] text-slate-400">{app.candidate?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-300">
                        {app.job?.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <SkillMatchBadge score={app.matchScore} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} size="xs" />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedAppForAi(app)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-semibold text-[11px] transition-colors"
                        >
                          AI Insights
                        </button>
                        <button
                          onClick={() => setSelectedAppForStatus(app)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          Status
                        </button>
                        <button
                          onClick={() => setSelectedAppForInterview(app)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-semibold text-[11px] transition-colors"
                        >
                          Interview
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modals */}
      {selectedAppForStatus && (
        <StatusUpdateModal
          isOpen={!!selectedAppForStatus}
          onClose={() => setSelectedAppForStatus(null)}
          application={selectedAppForStatus}
          onUpdated={() => fetchAnalytics()}
        />
      )}

      {selectedAppForInterview && (
        <ScheduleInterviewModal
          isOpen={!!selectedAppForInterview}
          onClose={() => setSelectedAppForInterview(null)}
          application={selectedAppForInterview}
          onScheduled={() => fetchAnalytics()}
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

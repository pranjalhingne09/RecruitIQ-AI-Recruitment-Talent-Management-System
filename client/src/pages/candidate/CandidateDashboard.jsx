import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { matchingService } from '../../services/matchingService';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/applications/StatusBadge';
import { SkillMatchBadge } from '../../components/resumes/SkillMatchBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Video,
} from 'lucide-react';

export const CandidateDashboard = () => {
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [analyticsRes, recsRes] = await Promise.all([
          analyticsService.getCandidateAnalytics(),
          matchingService.getRecommendedJobs(),
        ]);

        if (analyticsRes.success && analyticsRes.data) {
          setData(analyticsRes.data);
        }
        if (recsRes.success && recsRes.data?.recommendations) {
          setRecommendations(recsRes.data.recommendations.slice(0, 3));
        }
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-28" />
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Profile Strength */}
      <Card className="p-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/30 border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              Candidate Workspace
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5 font-['Space_Grotesk']">
              Talent Command Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track active applications, review scheduled interviews, and check AI job matches
            </p>
          </div>

          {/* Profile Completion Bar */}
          <div className="sm:w-64 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Profile Strength</span>
              <span className="font-bold text-cyan-400">{data?.profileCompletion || 25}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${data?.profileCompletion || 25}%` }}
              />
            </div>
            <Link
              to="/candidate/profile"
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium mt-2 block text-right"
            >
              Complete Profile →
            </Link>
          </div>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Submitted"
          value={metrics.totalApplications || 0}
          subtitle="Total applications"
          icon={Briefcase}
          iconColor="text-indigo-400"
        />
        <StatCard
          title="Under Review"
          value={metrics.underReview || 0}
          subtitle="Screening stage"
          icon={Clock}
          iconColor="text-purple-400"
        />
        <StatCard
          title="Interviews"
          value={metrics.interviewsScheduled || 0}
          subtitle="Scheduled rounds"
          icon={Calendar}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Avg Skill Match"
          value={`${metrics.avgMatchScore || 0}%`}
          subtitle="Across applied roles"
          icon={TrendingUp}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Recommended Jobs Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
              Top Matched Vacancies for You
            </h2>
          </div>
          <Link
            to="/candidate/recommendations"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            View All Matches <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No recommended jobs yet"
            description="Upload your resume in the Resume Vault or update your profile skills to generate personalized match recommendations."
            actionLabel="Go to Resume Vault"
            onAction={() => {}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((item) => (
              <Card key={item.job._id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                      {item.job.company?.name || 'Company'}
                    </span>
                    <SkillMatchBadge score={item.matchScore} size="sm" showLabel={false} />
                  </div>
                  <h3 className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                    {item.job.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{item.job.location}</p>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                    {item.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    ${item.job.salaryMin?.toLocaleString()} - ${item.job.salaryMax?.toLocaleString()}
                  </span>
                  <Link
                    to={`/jobs/${item.job._id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View Job →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
              Recent Applications
            </h2>
            <Link
              to="/candidate/applications"
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              See all
            </Link>
          </div>

          <Card className="p-4 space-y-3">
            {(!data?.recentApplications || data.recentApplications.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-500">
                You haven't submitted any applications yet.
              </div>
            ) : (
              data.recentApplications.map((app) => (
                <Link
                  key={app._id}
                  to={`/candidate/applications/${app._id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 transition-all group"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                      {app.job?.title || 'Job Opening'}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {app.job?.company?.name || 'Company'} • Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <SkillMatchBadge score={app.matchScore} size="sm" showLabel={false} />
                    <StatusBadge status={app.status} size="xs" />
                  </div>
                </Link>
              ))
            )}
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
              Upcoming Interviews
            </h2>
            <Link
              to="/candidate/interviews"
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Calendar
            </Link>
          </div>

          <Card className="p-4 space-y-3">
            {(!data?.upcomingInterviews || data.upcomingInterviews.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No upcoming interviews scheduled.
              </div>
            ) : (
              data.upcomingInterviews.map((iv) => (
                <div
                  key={iv._id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {iv.title || iv.job?.title}
                    </span>
                    <Badge variant="cyan" size="xs">
                      {iv.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(iv.scheduledDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      {iv.startTime} - {iv.endTime}
                    </span>
                  </div>
                  {iv.meetingLink && (
                    <a
                      href={iv.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold pt-1"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Meeting Link
                    </a>
                  )}
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

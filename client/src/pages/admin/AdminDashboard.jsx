import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import {
  Users,
  Briefcase,
  Layers,
  FileCheck,
  Calendar,
  Activity,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getAdminAnalytics();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Admin analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={3} height="h-32" />;
  }

  const metrics = data?.metrics || {};
  const pipelineFunnel = data?.pipelineFunnel || [];
  const monthlyTrends = data?.monthlyTrends || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            Platform Administration Console
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
            System Intelligence & Governance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Global metrics, hiring pipeline conversions, audit trails, and platform integrity
          </p>
        </div>

        <Link to="/admin/audit-logs">
          <Badge variant="cyan" size="sm">
            Live Audit Stream Active
          </Badge>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Platform Users"
          value={metrics.totalUsers || 0}
          subtitle={`${metrics.totalCandidates || 0} candidates • ${metrics.totalRecruiters || 0} recruiters`}
          icon={Users}
          iconColor="text-indigo-400"
        />
        <StatCard
          title="Active Vacancies"
          value={metrics.activeJobs || 0}
          subtitle={`${metrics.totalJobs || 0} total listings`}
          icon={Briefcase}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Applications"
          value={metrics.totalApplications || 0}
          subtitle="System-wide submissions"
          icon={FileCheck}
          iconColor="text-purple-400"
        />
        <StatCard
          title="Interviews"
          value={metrics.totalInterviews || 0}
          subtitle="Conducted rounds"
          icon={Calendar}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel Bar Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Global Hiring Pipeline Funnel
              </h3>
              <p className="text-[11px] text-slate-400">Application count per stage</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineFunnel} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trend Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                Platform Activity Trajectory
              </h3>
              <p className="text-[11px] text-slate-400">Monthly candidate submission volume</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Platform Audit Trail */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Recent Platform Activity Stream
          </h2>
          <Link
            to="/admin/audit-logs"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Inspect Full Audit Trail →
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="divide-y divide-slate-800/60">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No platform activity logged yet.
              </div>
            ) : (
              recentActivity.map((log) => (
                <div key={log._id} className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {log.action}
                    </span>
                    <span className="text-slate-300">
                      {log.user ? `${log.user.name} (${log.user.role})` : 'System Process'}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{log.resource}</span>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { applicationService } from '../../services/applicationService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/applications/StatusBadge';
import { SkillMatchBadge } from '../../components/resumes/SkillMatchBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  ArrowRight,
  Clock,
  Undo2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/candidates/applications');
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
    fetchApplications();
  }, []);

  const handleWithdraw = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to withdraw your application?')) return;
    try {
      const res = await applicationService.withdraw(id);
      if (res.success) {
        toast.success('Application withdrawn successfully.');
        fetchApplications();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw application.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          My Submitted Applications
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your recruitment progress, review status logs, and inspect interview invites
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-28" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications submitted yet"
          description="Explore our curated open vacancies and apply using your uploaded resume."
          actionLabel="Browse Open Vacancies"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                      <Link to={`/candidate/applications/${app._id}`}>{app.job?.title}</Link>
                    </h3>
                    <StatusBadge status={app.status} size="xs" />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">
                      {app.job?.company?.name || 'Company'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {app.job?.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <SkillMatchBadge score={app.matchScore} size="md" />

                  <Link to={`/candidate/applications/${app._id}`}>
                    <Button variant="outline" size="sm">
                      View Progress
                    </Button>
                  </Link>

                  {!['HIRED', 'REJECTED', 'WITHDRAWN'].includes(app.status) && (
                    <button
                      onClick={(e) => handleWithdraw(app._id, e)}
                      className="text-xs text-slate-500 hover:text-rose-400 font-medium transition-colors"
                      title="Withdraw application"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>

              {/* Status Note Preview */}
              {app.statusHistory?.length > 1 && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    Latest update:{' '}
                    <strong className="text-slate-300">
                      {app.statusHistory[app.statusHistory.length - 1].note || 'Stage updated'}
                    </strong>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(app.statusHistory[app.statusHistory.length - 1].timestamp).toLocaleDateString()}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

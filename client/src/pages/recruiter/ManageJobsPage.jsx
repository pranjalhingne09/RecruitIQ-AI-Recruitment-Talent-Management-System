import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Briefcase,
  PlusCircle,
  Users,
  Eye,
  Edit,
  Trash2,
  Power,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getRecruiterJobs();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      toast.error('Failed to load published jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await jobService.toggleStatus(id);
      if (res.success) {
        toast.success(res.message);
        fetchJobs();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update job status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job vacancy?')) return;
    try {
      await jobService.deleteJob(id);
      toast.success('Job removed successfully.');
      fetchJobs();
    } catch (err) {
      toast.error(err.message || 'Failed to delete job.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Manage Published Vacancies
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee active job listings, toggle applications, and review applicant funnels
          </p>
        </div>

        <Link to="/recruiter/jobs/create">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Publish New Job
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-28" />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No vacancies posted yet"
          description="Create your first job listing to start receiving candidate applications and AI match scores."
          actionLabel="Publish First Vacancy"
          onAction={() => {}}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applicants</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Posted Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                      >
                        {job.title} <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Link>
                      <div className="text-[11px] text-slate-400 font-normal">{job.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {job.category?.name || 'Engineering'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={job.status === 'active' ? 'success' : 'default'}
                        size="xs"
                      >
                        {job.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-cyan-400">
                      <Link
                        to={`/recruiter/applications?jobId=${job._id}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" /> {job.applicantsCount || 0}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1 pt-4">
                      <Eye className="w-3.5 h-3.5" /> {job.viewsCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(job._id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          job.status === 'active'
                            ? 'text-amber-400 border-amber-500/30 hover:bg-amber-500/10'
                            : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                        }`}
                        title={job.status === 'active' ? 'Close applications' : 'Reactivate job'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <Link to={`/recruiter/jobs/edit/${job._id}`}>
                        <button
                          className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(job._id)}
                        className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

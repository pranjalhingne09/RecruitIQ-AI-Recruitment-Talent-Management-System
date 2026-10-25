import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Briefcase, Trash2, Search, ExternalLink, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllJobs({
        search: search.trim() || undefined,
        limit: 25,
      });
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      toast.error('Failed to load platform jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove the job posting "${title}" as Administrator?`)) return;
    try {
      const res = await adminService.deleteJob(id);
      if (res.success) {
        toast.success('Job posting removed from platform.');
        fetchJobs();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove job.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          Platform Job Oversight & Moderation
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review all published listings across all recruiters, monitor compliance, and moderate vacancies
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="h-24" />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found on platform"
          description="Job listings posted by recruiters will appear here for oversight."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Recruiter</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="hover:text-indigo-400 flex items-center gap-1.5"
                      >
                        {job.title} <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Link>
                      <div className="text-[11px] text-slate-400 font-normal">{job.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {job.company?.name || 'Company'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <div>{job.recruiter?.name}</div>
                      <div className="text-[10px] text-slate-500">{job.recruiter?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {job.category?.name || 'General'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={job.status === 'active' ? 'success' : 'default'}
                        size="xs"
                      >
                        {job.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!job.isDeleted && (
                        <button
                          onClick={() => handleDelete(job._id, job.title)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Job
                        </button>
                      )}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  MapPin,
  Building,
  DollarSign,
  Filter,
  ArrowRight,
  Briefcase,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobs({
        search: search.trim() || undefined,
        location: location.trim() || undefined,
        employmentType: employmentType !== 'all' ? employmentType : undefined,
        experienceLevel: experienceLevel !== 'all' ? experienceLevel : undefined,
        category: category !== 'all' ? category : undefined,
        sortBy,
        page,
        limit: 8,
      });

      if (res.success && res.data) {
        setJobs(res.data);
        if (res.meta) {
          setTotal(res.meta.total);
          setPages(res.meta.pages);
        }
      }
    } catch (err) {
      console.warn('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await adminService.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        // Ignored
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page, employmentType, experienceLevel, category, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setEmploymentType('all');
    setExperienceLevel('all');
    setCategory('all');
    setSortBy('createdAt');
    setPage(1);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
            Discover Open Vacancies
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified job postings and inspect explicit skill requirements
          </p>
        </div>

        {/* Search Bar Bar Form */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, skill keywords, or company..."
              className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. San Francisco, Remote)..."
              className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <Button variant="primary" type="submit" size="md" className="w-full">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Filter Chips & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Employment Type */}
          <select
            value={employmentType}
            onChange={(e) => {
              setEmploymentType(e.target.value);
              setPage(1);
            }}
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>

          {/* Experience Level */}
          <select
            value={experienceLevel}
            onChange={(e) => {
              setExperienceLevel(e.target.value);
              setPage(1);
            }}
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Experience Levels</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
            <option value="Lead">Lead / Architect</option>
          </select>

          {/* Category */}
          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {(search || location || employmentType !== 'all' || experienceLevel !== 'all' || category !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium ml-2"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="createdAt">Latest Posted</option>
            <option value="salary">Highest Salary</option>
            <option value="applicants">Most Applicants</option>
          </select>
        </div>
      </div>

      {/* Job Listings Grid */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-4">
          Showing {jobs.length} of {total} available positions
        </div>

        {loading ? (
          <LoadingSkeleton count={4} height="h-32" />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No matching job vacancies found"
            description="Try modifying your keyword search, removing location restrictions, or adjusting your filter criteria."
            actionLabel="Reset Search Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} className="group">
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {job.title}
                        </h3>
                        <Badge variant="cyan" size="xs">
                          {job.employmentType}
                        </Badge>
                        <Badge variant="purple" size="xs">
                          {job.experienceLevel}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-300">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          {job.company?.name || 'Company'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {job.location}
                        </span>
                        {job.salaryMax > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / yr
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 shrink-0">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold self-center mr-1">
                        Skills:
                      </span>
                      {job.requiredSkills?.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                      View Position & Apply <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              icon={ChevronLeft}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-400 px-4">
              Page {page} of {pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

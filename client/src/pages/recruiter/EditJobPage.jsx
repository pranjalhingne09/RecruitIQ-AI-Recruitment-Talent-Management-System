import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Save, Plus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid',
    salaryMin: 120000,
    salaryMax: 160000,
    salaryCurrency: 'USD',
    deadline: '',
    description: '',
    requirements: '',
    responsibilities: '',
  });

  const [requiredSkills, setRequiredSkills] = useState([]);
  const [newRequiredSkill, setNewRequiredSkill] = useState('');

  const [niceToHaveSkills, setNiceToHaveSkills] = useState([]);
  const [newNiceSkill, setNewNiceSkill] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, jobRes] = await Promise.all([
          adminService.getCategories(),
          jobService.getJobById(id),
        ]);

        if (catsRes.success && catsRes.data) {
          setCategories(catsRes.data);
        }

        if (jobRes.success && jobRes.data) {
          const j = jobRes.data;
          setFormData({
            title: j.title || '',
            category: j.category?._id || j.category || '',
            location: j.location || '',
            employmentType: j.employmentType || 'Full-time',
            experienceLevel: j.experienceLevel || 'Mid',
            salaryMin: j.salaryMin || 0,
            salaryMax: j.salaryMax || 0,
            salaryCurrency: j.salaryCurrency || 'USD',
            deadline: j.deadline ? j.deadline.split('T')[0] : '',
            description: j.description || '',
            requirements: j.requirements || '',
            responsibilities: j.responsibilities || '',
          });
          setRequiredSkills(j.requiredSkills || []);
          setNiceToHaveSkills(j.niceToHaveSkills || []);
        }
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/recruiter/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleAddRequiredSkill = (e) => {
    e.preventDefault();
    const trimmed = newRequiredSkill.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
      setNewRequiredSkill('');
    }
  };

  const handleAddNiceSkill = (e) => {
    e.preventDefault();
    const trimmed = newNiceSkill.trim();
    if (trimmed && !niceToHaveSkills.includes(trimmed)) {
      setNiceToHaveSkills([...niceToHaveSkills, trimmed]);
      setNewNiceSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await jobService.updateJob(id, {
        ...formData,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        requiredSkills,
        niceToHaveSkills,
      });

      if (res.success) {
        toast.success('Job posting updated successfully!');
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save job changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} height="h-32" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/recruiter/jobs')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Jobs
          </button>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Edit Job Vacancy
          </h1>
        </div>

        <Button variant="primary" type="submit" size="md" isLoading={saving} icon={Save}>
          Save Updates
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Position Fundamentals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Location *"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Lead">Lead / Architect</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Min Salary ($/yr)"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
          />

          <Input
            label="Max Salary ($/yr)"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Required Core Skills (Matching Criteria)
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRequiredSkill}
            onChange={(e) => setNewRequiredSkill(e.target.value)}
            placeholder="Add required skill..."
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <Button variant="secondary" size="sm" type="button" onClick={handleAddRequiredSkill}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {requiredSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-cyan-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => setRequiredSkills(requiredSkills.filter((s) => s !== skill))}
                className="text-slate-500 hover:text-rose-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Job Description
        </h3>
        <textarea
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          required
        />
      </Card>
    </form>
  );
};

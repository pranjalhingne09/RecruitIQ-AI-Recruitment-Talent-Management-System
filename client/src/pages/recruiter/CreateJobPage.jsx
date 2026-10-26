import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Plus, X, Briefcase, Sparkles, MapPin, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateJobPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid',
    salaryMin: 1800000,
    salaryMax: 2800000,
    salaryCurrency: 'INR',
    deadline: '',
    description: '',
    requirements: '',
    responsibilities: '',
  });

  const [requiredSkills, setRequiredSkills] = useState(['React', 'Node.js', 'MongoDB']);
  const [newRequiredSkill, setNewRequiredSkill] = useState('');

  const [niceToHaveSkills, setNiceToHaveSkills] = useState(['Docker', 'AWS']);
  const [newNiceSkill, setNewNiceSkill] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await adminService.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
          }
        }
      } catch (err) {
        // Ignored
      }
    };
    fetchCats();
  }, []);

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
    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in job title, description, and location.');
      return;
    }
    if (requiredSkills.length === 0) {
      toast.error('Please specify at least one required skill.');
      return;
    }

    try {
      setLoading(true);
      const res = await jobService.createJob({
        ...formData,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        requiredSkills,
        niceToHaveSkills,
      });

      if (res.success) {
        toast.success('Job vacancy published successfully!');
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Publish New Job Vacancy
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create an open position with explicit skill requirements for transparent matching
          </p>
        </div>

        <Button variant="primary" type="submit" size="md" isLoading={loading} icon={Plus}>
          Publish Vacancy
        </Button>
      </div>

      {/* Role Fundamentals */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Position Fundamentals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Senior Full-Stack Engineer (React / Node)"
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
            icon={MapPin}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Bengaluru, Karnataka / Hybrid"
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Min Salary (₹/yr)"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
            placeholder="1800000"
          />

          <Input
            label="Max Salary (₹/yr)"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
            placeholder="2800000"
          />

          <Input
            label="Application Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
      </Card>

      {/* Skills Configuration */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Skill Requirements (AI Matching Criteria)
        </h3>

        {/* Required Skills */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Mandatory Required Skills *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newRequiredSkill}
              onChange={(e) => setNewRequiredSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRequiredSkill(e);
                }
              }}
              placeholder="e.g. React, Node.js, MongoDB..."
              className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
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
        </div>

        {/* Nice-to-have Skills */}
        <div className="space-y-2 pt-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Preferred / Nice-to-Have Skills (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNiceSkill}
              onChange={(e) => setNewNiceSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNiceSkill(e);
                }
              }}
              placeholder="e.g. Docker, AWS, GraphQL..."
              className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <Button variant="secondary" size="sm" type="button" onClick={handleAddNiceSkill}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {niceToHaveSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => setNiceToHaveSkills(niceToHaveSkills.filter((s) => s !== skill))}
                  className="text-slate-500 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Narrative Job Descriptions */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Job Description & Qualifications
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Role Overview & Mission *
          </label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Explain the team mission, tech stack, and what the candidate will achieve in this role..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Qualifications & Requirements
          </label>
          <textarea
            rows={4}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="• 3+ years of professional full-stack development experience&#10;• Experience designing distributed microservices..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Key Responsibilities
          </label>
          <textarea
            rows={4}
            value={formData.responsibilities}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            placeholder="• Lead architecture reviews&#10;• Ship clean, tested code..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </Card>
    </form>
  );
};

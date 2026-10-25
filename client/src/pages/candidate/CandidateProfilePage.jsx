import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import api from '../../services/api';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Globe,
  Github,
  Linkedin,
  MapPin,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CandidateProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    portfolio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/candidates/profile');
        if (res.success && res.data) {
          const p = res.data;
          setProfile(p);
          setHeadline(p.headline || '');
          setBio(p.bio || '');
          setLocation(p.location || '');
          setSkills(p.skills || []);
          setEducation(p.education || []);
          setExperience(p.experience || []);
          setSocialLinks(p.socialLinks || { github: '', linkedin: '', portfolio: '' });
        }
      } catch (err) {
        toast.error('Failed to load candidate profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        school: '',
        degree: '',
        fieldOfStudy: '',
        startYear: new Date().getFullYear() - 4,
        endYear: new Date().getFullYear(),
        grade: '',
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        title: '',
        company: '',
        location: '',
        isCurrent: true,
        description: '',
      },
    ]);
  };

  const handleRemoveExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/candidates/profile', {
        headline,
        bio,
        location,
        skills,
        education,
        experience,
        socialLinks,
      });

      if (res.success) {
        toast.success('Profile updated successfully!');
        setProfile(res.data);
        await refreshUser();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} height="h-36" />;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Candidate Profile & Competencies
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Keep your skills, bio, and career timeline current for accurate AI job matching
          </p>
        </div>

        <Button variant="primary" type="submit" size="md" isLoading={saving} icon={Save}>
          Save Changes
        </Button>
      </div>

      {/* Basic Info Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Basic Career Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Professional Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer | React & Node.js"
          />

          <Input
            label="Location"
            icon={MapPin}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA / Remote"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Bio & Professional Summary
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Summarize your engineering journey, architectural strengths, and career aspirations..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </Card>

      {/* Verified Skills Tag Manager */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Technical Skills & Competencies
            </h3>
            <p className="text-[11px] text-slate-400">
              Skills are compared against job requirements to calculate transparent match scores.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-400">
            {skills.length} skills listed
          </span>
        </div>

        {/* Skill Add Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(e);
              }
            }}
            placeholder="Add skill (e.g. TypeScript, Docker, Kubernetes)..."
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <Button variant="secondary" size="sm" type="button" onClick={handleAddSkill} icon={Plus}>
            Add Skill
          </Button>
        </div>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 group hover:border-slate-700"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </Card>

      {/* Experience Timeline */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" /> Work Experience
          </h3>
          <Button variant="secondary" size="sm" type="button" onClick={handleAddExperience} icon={Plus}>
            Add Role
          </Button>
        </div>

        <div className="space-y-4">
          {experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3 relative group"
            >
              <button
                type="button"
                onClick={() => handleRemoveExperience(idx)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <Input
                  label="Job Title"
                  value={exp.title}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[idx].title = e.target.value;
                    setExperience(updated);
                  }}
                  placeholder="Senior Software Engineer"
                />

                <Input
                  label="Company Name"
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[idx].company = e.target.value;
                    setExperience(updated);
                  }}
                  placeholder="Stripe, Google, TechCorp..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Key Achievements & Responsibilities
                </label>
                <textarea
                  rows={2}
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[idx].description = e.target.value;
                    setExperience(updated);
                  }}
                  placeholder="Designed backend APIs, reduced latency, led team of 4 engineers..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Education Timeline */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" /> Education
          </h3>
          <Button variant="secondary" size="sm" type="button" onClick={handleAddEducation} icon={Plus}>
            Add Education
          </Button>
        </div>

        <div className="space-y-4">
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveEducation(idx)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                <Input
                  label="University / Institution"
                  value={edu.school}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx].school = e.target.value;
                    setEducation(updated);
                  }}
                  placeholder="UC Berkeley, Stanford..."
                />

                <Input
                  label="Degree & Major"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx].degree = e.target.value;
                    setEducation(updated);
                  }}
                  placeholder="B.S. in Computer Science"
                />

                <Input
                  label="Graduation Year"
                  type="number"
                  value={edu.endYear || ''}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[idx].endYear = Number(e.target.value);
                    setEducation(updated);
                  }}
                  placeholder="2022"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Online Presence & Social Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="GitHub URL"
            icon={Github}
            value={socialLinks.github || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
            placeholder="https://github.com/username"
          />

          <Input
            label="LinkedIn URL"
            icon={Linkedin}
            value={socialLinks.linkedin || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/username"
          />

          <Input
            label="Portfolio Website"
            icon={Globe}
            value={socialLinks.portfolio || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, portfolio: e.target.value })}
            placeholder="https://myportfolio.dev"
          />
        </div>
      </Card>
    </form>
  );
};

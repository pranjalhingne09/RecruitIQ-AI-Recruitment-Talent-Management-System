import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Sparkles, User, Mail, Lock, Building, Briefcase, Globe, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const RecruiterRegisterPage = () => {
  const { registerRecruiter } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    position: 'Talent Acquisition Partner',
    industry: 'Software & Technology',
    website: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.companyName) {
      toast.error('Please fill in your name, email, password, and company name.');
      return;
    }

    try {
      setLoading(true);
      await registerRecruiter(formData);
      toast.success('Recruiter account and company created successfully!');
      navigate('/recruiter');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-xl shadow-cyan-500/20 mb-3">
          <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          Recruiter & Organization Setup
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Publish job vacancies, analyze incoming candidate resumes, and manage interview pipelines
        </p>
      </div>

      <Card className="p-6 sm:p-8" elevated>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name *"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Sarah Chen"
              required
            />

            <Input
              label="Work Email Address *"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah@company.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password (min. 6 characters) *"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />

            <Input
              label="Your Job Title / Position"
              icon={Briefcase}
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Lead Technical Recruiter"
            />
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block mb-3">
              Company Profile
            </span>

            <div className="space-y-4">
              <Input
                label="Company / Organization Name *"
                icon={Building}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Google, Stripe, Apex Labs..."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Fintech, Healthtech, Cloud..."
                />

                <Input
                  label="Company Headquarters / Location"
                  icon={MapPin}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Bengaluru, Karnataka"
                />
              </div>

              <Input
                label="Company Careers Website"
                icon={Globe}
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.com/careers"
              />
            </div>
          </div>

          <Button variant="primary" type="submit" size="md" isLoading={loading} className="w-full mt-4">
            Register Recruiter Organization
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-medium">
            Sign In here
          </Link>{' '}
          •{' '}
          <Link to="/register/candidate" className="text-cyan-400 hover:underline font-medium">
            Register as Candidate
          </Link>
        </div>
      </Card>
    </div>
  );
};

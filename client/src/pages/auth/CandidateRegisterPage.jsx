import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Sparkles, User, Mail, Lock, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export const CandidateRegisterPage = () => {
  const { registerCandidate } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await registerCandidate(formData);
      toast.success('Candidate profile created successfully!');
      navigate('/candidate');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 shadow-xl shadow-indigo-500/20 mb-3">
          <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          Candidate Registration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Create your career profile, upload resumes, and discover AI-matched roles
        </p>
      </div>

      <Card className="p-6 sm:p-8" elevated>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Doe"
            required
          />

          <Input
            label="Email Address *"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
            required
          />

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
            label="Phone Number"
            type="tel"
            icon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />

          <Button variant="primary" type="submit" size="md" isLoading={loading} className="w-full mt-2">
            Create Candidate Account
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-medium">
            Sign In here
          </Link>{' '}
          •{' '}
          <Link to="/register/recruiter" className="text-cyan-400 hover:underline font-medium">
            Recruiter Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
};

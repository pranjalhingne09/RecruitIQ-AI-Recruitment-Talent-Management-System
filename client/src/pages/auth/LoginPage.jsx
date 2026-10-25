import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Sparkles, Mail, Lock, Zap, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      toast.success('Signed in successfully!');
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'recruiter') navigate('/recruiter');
      else navigate(from === '/' ? '/candidate' : from);
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setLoading(true);
      const res = await login({ email: demoEmail, password: demoPassword });
      toast.success(`Signed in as ${res.user.role.toUpperCase()}!`);
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'recruiter') navigate('/recruiter');
      else navigate('/candidate');
    } catch (err) {
      toast.error(err.message);
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
          Welcome to Recruit<span className="text-gradient-primary">IQ</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Access your AI recruitment console or candidate profile
        </p>
      </div>

      <Card className="p-6 sm:p-8" elevated>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button variant="primary" type="submit" size="md" isLoading={loading} className="w-full mt-2">
            Sign In to Console
          </Button>
        </form>

        {/* Demo Preset Buttons for Evaluator Convenience */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> 1-Click Evaluator Fast-Track Logins
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@recruitiq.com', 'Admin@123456')}
              className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-indigo-400 block">System Admin</span>
                <span className="text-[10px] text-slate-500">Full platform oversight & audit trail</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('recruiter@google.com', 'Password@123')}
              className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-cyan-400 block">Google Recruiter (Sarah Chen)</span>
                <span className="text-[10px] text-slate-500">Post jobs, review applicants, schedule interviews</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('alex.rivers@gmail.com', 'Password@123')}
              className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-emerald-400 block">Candidate (Alex Rivers)</span>
                <span className="text-[10px] text-slate-500">Full-Stack Engineer with uploaded resume</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register/candidate" className="text-indigo-400 hover:underline font-medium">
            Register as Candidate
          </Link>{' '}
          or{' '}
          <Link to="/register/recruiter" className="text-cyan-400 hover:underline font-medium">
            Recruiter
          </Link>
        </div>
      </Card>
    </div>
  );
};

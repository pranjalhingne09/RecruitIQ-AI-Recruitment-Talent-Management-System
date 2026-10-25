import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Sparkles,
  Briefcase,
  Calendar,
  Building,
  PlusCircle,
  Users,
  ShieldAlert,
  FolderTree,
  Activity,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const candidateLinks = [
    { to: '/candidate', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/candidate/profile', icon: User, label: 'Profile & Skills' },
    { to: '/candidate/resumes', icon: FileText, label: 'Resume Vault' },
    { to: '/candidate/recommendations', icon: Sparkles, label: 'AI Match Jobs' },
    { to: '/candidate/applications', icon: Briefcase, label: 'My Applications' },
    { to: '/candidate/interviews', icon: Calendar, label: 'Interviews' },
  ];

  const recruiterLinks = [
    { to: '/recruiter', icon: LayoutDashboard, label: 'Overview', exact: true },
    { to: '/recruiter/jobs', icon: Briefcase, label: 'Manage Jobs' },
    { to: '/recruiter/jobs/create', icon: PlusCircle, label: 'Publish Vacancy' },
    { to: '/recruiter/applications', icon: Users, label: 'Applicants' },
    { to: '/recruiter/interviews', icon: Calendar, label: 'Interviews' },
    { to: '/recruiter/company', icon: Building, label: 'Company Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Platform Stats', exact: true },
    { to: '/admin/users', icon: Users, label: 'User Directory' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Job Oversight' },
    { to: '/admin/categories', icon: FolderTree, label: 'Job Categories' },
    { to: '/admin/audit-logs', icon: Activity, label: 'Audit Trail' },
  ];

  let links = candidateLinks;
  if (user.role === 'recruiter') links = recruiterLinks;
  if (user.role === 'admin') links = adminLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 bg-[#080d1a]/60">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-sm text-white overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white truncate">{user.name}</h4>
            <span className="inline-block text-[10px] font-medium text-indigo-400 capitalize bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 mt-0.5">
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div>
          <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 px-3 mb-2">
            Workspace
          </div>
          <nav className="space-y-1">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white border border-indigo-500/30 shadow-md shadow-indigo-950/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-slate-800 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer logout */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

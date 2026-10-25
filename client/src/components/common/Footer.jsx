import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Github, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060a14] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-[#080d1a] rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="text-lg font-bold text-white tracking-tight font-['Space_Grotesk']">
              Recruit<span className="text-gradient-primary">IQ</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            AI-Assisted Recruitment & Transparent Talent Intelligence Platform. Designed with explainable skills-based matching algorithms and ethical human-in-the-loop decision support.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> Secure RBAC
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Explainable Matching
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">
            Platform Roles
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/register/candidate" className="hover:text-indigo-400 transition-colors">
                Candidate Career Hub
              </Link>
            </li>
            <li>
              <Link to="/register/recruiter" className="hover:text-indigo-400 transition-colors">
                Recruiter Talent Suite
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-indigo-400 transition-colors">
                Admin Console Access
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="hover:text-indigo-400 transition-colors">
                Browse Vacancies
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">
            Engineering Project
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Final-Year Engineering College Project Capstone. Built with React, Vite, Node.js, Express, MongoDB, and Tailwind CSS.
          </p>
          <div className="text-[11px] text-slate-500">
            © 2026 RecruitIQ Systems. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

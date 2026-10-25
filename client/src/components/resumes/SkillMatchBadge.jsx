import React from 'react';
import { Sparkles } from 'lucide-react';

export const SkillMatchBadge = ({ score = 0, size = 'md', showLabel = true }) => {
  let colorStyles = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  let tier = 'Potential Fit';

  if (score >= 80) {
    colorStyles = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-cyan-500/10';
    tier = 'High Match';
  } else if (score >= 60) {
    colorStyles = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/10';
    tier = 'Moderate Match';
  } else if (score >= 40) {
    colorStyles = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    tier = 'Partial Match';
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${colorStyles} ${sizes[size]} font-semibold tracking-wide`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>{score}%</span>
      {showLabel && <span className="opacity-75 font-normal text-[11px]">• {tier}</span>}
    </div>
  );
};

import React from 'react';
import { Card } from '../common/Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = 'from-indigo-500/20 to-cyan-500/20',
  iconColor = 'text-indigo-400',
  trend,
}) => {
  return (
    <Card className="p-6 relative overflow-hidden group">
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-tr ${gradient} blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          {value}
        </h3>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center">
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </Card>
  );
};

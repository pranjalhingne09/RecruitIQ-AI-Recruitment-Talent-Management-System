import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = 'h-24', className = '' }) => {
  return (
    <div className={`space-y-4 w-full ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} rounded-2xl bg-slate-800/40 border border-slate-800 animate-pulse`}
        />
      ))}
    </div>
  );
};

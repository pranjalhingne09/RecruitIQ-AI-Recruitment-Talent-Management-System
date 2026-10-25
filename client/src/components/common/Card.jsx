import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = true,
  elevated = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        elevated ? 'glass-panel-elevated' : 'glass-panel'
      } ${hover ? 'glow-card' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

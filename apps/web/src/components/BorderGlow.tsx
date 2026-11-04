import React from 'react';

export const BorderGlow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <div
        className="absolute -inset-[2px] bg-gradient-to-r from-[#F7A81B] to-[#D41B2C] rounded-[inherit] opacity-40 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
        style={{ willChange: 'opacity' }}
      />
      <div className="relative h-full w-full rounded-[inherit] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

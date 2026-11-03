import React from 'react';
import { motion } from 'framer-motion';

export const BorderGlow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-[2px] bg-gradient-to-r from-[#F7A81B] to-[#D41B2C] rounded-[inherit] blur-sm opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
      />
      <div className="relative h-full w-full rounded-[inherit] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

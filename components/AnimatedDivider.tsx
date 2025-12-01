import React from 'react';

interface AnimatedDividerProps {
  variant?: 'cyan' | 'purple';
  className?: string;
}

const AnimatedDivider: React.FC<AnimatedDividerProps> = ({ variant = 'cyan', className = '' }) => {
  const color = variant === 'cyan' ? 'cyan' : 'purple';
  
  // Dynamic class names based on color prop
  const gradientColor = variant === 'cyan' ? 'via-cyan-500' : 'via-purple-500';
  const beamColor = variant === 'cyan' ? 'via-cyan-400' : 'via-purple-400';
  const borderColor = variant === 'cyan' ? 'border-cyan-500' : 'border-purple-500';
  const shadowColor = variant === 'cyan' ? 'shadow-cyan-500/50' : 'shadow-purple-500/50';
  const textColor = variant === 'cyan' ? 'text-cyan-500' : 'text-purple-500';

  return (
    <div className={`relative w-full py-16 flex items-center justify-center overflow-hidden pointer-events-none ${className}`}>
      
      {/* Background Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-24 bg-${color}-500/10 blur-[40px] rounded-full`}></div>

      {/* Main Horizontal Line */}
      <div className={`w-full max-w-7xl h-px bg-gradient-to-r from-transparent ${gradientColor} to-transparent opacity-30`}></div>

      {/* Moving Data Packet (Shuttle) */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden h-4">
        <div className={`absolute top-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent ${beamColor} to-transparent blur-[1px] animate-shuttle`}></div>
      </div>

      {/* Center Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 bg-slate-50 dark:bg-[#030014] px-4 z-10 transition-colors duration-300">
        
        {/* Left bracket */}
        <span className={`text-xs font-mono font-bold ${textColor} opacity-50`}>&lt;</span>

        {/* Center Diamond */}
        <div className="relative">
          <div className={`w-3 h-3 rotate-45 border ${borderColor} bg-slate-50 dark:bg-[#030014] transition-colors duration-300`}></div>
          <div className={`absolute inset-0 ${shadowColor} shadow-[0_0_10px_currentColor] animate-pulse`}></div>
        </div>

        {/* Right bracket */}
        <span className={`text-xs font-mono font-bold ${textColor} opacity-50`}>/&gt;</span>
      </div>

    </div>
  );
};

export default AnimatedDivider;
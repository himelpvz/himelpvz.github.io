import React from 'react';
import { Icons } from './Icons';

const skills = [
  {
    name: "Android Developer",
    icon: <Icons.Smartphone className="w-6 h-6" />,
    color: "from-green-400 to-emerald-600",
    glow: "group-hover:shadow-green-500/50",
    border: "group-hover:border-green-500/50",
    delay: "0s"
  },
  {
    name: "Device Tree Engineer",
    icon: <Icons.Cpu className="w-6 h-6" />,
    color: "from-blue-400 to-cyan-600",
    glow: "group-hover:shadow-cyan-500/50",
    border: "group-hover:border-cyan-500/50",
    delay: "0.1s"
  },
  {
    name: "TWRP Maintainer",
    icon: <Icons.HardDrive className="w-6 h-6" />,
    color: "from-orange-400 to-red-600",
    glow: "group-hover:shadow-orange-500/50",
    border: "group-hover:border-orange-500/50",
    delay: "0.2s"
  },
  {
    name: "AOSP / ROM Dev",
    icon: <Icons.GitBranch className="w-6 h-6" />,
    color: "from-purple-400 to-pink-600",
    glow: "group-hover:shadow-purple-500/50",
    border: "group-hover:border-purple-500/50",
    delay: "0.3s"
  },
  {
    name: "Kernel Tweaker",
    icon: <Icons.Zap className="w-6 h-6" />,
    color: "from-yellow-400 to-amber-600",
    glow: "group-hover:shadow-yellow-500/50",
    border: "group-hover:border-yellow-500/50",
    delay: "0.4s"
  }
];

const Skills: React.FC = () => {
  return (
    <div className="w-full py-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {skills.map((skill, index) => (
            <div 
              key={index}
              style={{ animationDelay: skill.delay }}
              className={`
                group relative px-6 py-3.5 rounded-xl 
                bg-white dark:bg-[#0a0a0f]/40 backdrop-blur-md border border-gray-200 dark:border-white/5 
                flex items-center gap-4 cursor-default overflow-hidden
                transition-all duration-300 ease-out 
                hover:-translate-y-1 hover:shadow-lg dark:hover:bg-[#0a0a0f]/60
                ${skill.border} dark:hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0)] ${skill.glow}
                animate-float
              `}
            >
              {/* Animated Gradient Background on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${skill.color} transition-opacity duration-300`} />
              
              {/* Icon Container */}
              <div className={`
                p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-white/20 dark:group-hover:bg-white/10 
                text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300
                relative z-10
              `}>
                {skill.icon}
              </div>

              {/* Text */}
              <span className="font-display font-medium text-sm md:text-base text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white tracking-wide relative z-10 transition-colors duration-300">
                {skill.name}
              </span>
              
              {/* Decorative Corner Glow */}
              <div className={`absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 rounded-full`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
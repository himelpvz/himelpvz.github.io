import React from 'react';
import Skills from '../components/Skills';
import { Icons } from '../components/Icons';
import AnimatedDivider from '../components/AnimatedDivider';

const SkillsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-mono">
            <Icons.Terminal size={14} />
            <span>TECHNICAL ARSENAL</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
            Professional <span className="text-gradient">Skills</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg">
            Expertise in Android system architecture, embedded development, and modern web technologies.
          </p>
        </div>

        <Skills />
        
        <AnimatedDivider variant="purple" className="my-8" />
        
        <div className="max-w-4xl mx-auto glass-panel p-8 rounded-2xl bg-white/50 dark:bg-black/20">
          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
             <Icons.Code className="text-purple-500" />
             Development Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <h4 className="font-mono text-sm font-bold text-gray-500 uppercase tracking-wider">Android & System</h4>
               <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> AOSP Build System</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Linux Kernel Tuning</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> TWRP & Recovery Porting</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Vendor Blobs Integration</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Partition Layout & FBE Decryption</li>
               </ul>
             </div>
             
             <div className="space-y-4">
               <h4 className="font-mono text-sm font-bold text-gray-500 uppercase tracking-wider">Web & Automation</h4>
               <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> React & TypeScript</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> GitHub Actions (CI/CD)</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> Shell Scripting / Bash</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> Git Workflow & Version Control</li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
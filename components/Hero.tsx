import React from 'react';
import { Icons } from './Icons';
import { Section } from '../types';

interface HeroProps {
  githubStats: any;
}

const Hero: React.FC<HeroProps> = ({ githubStats }) => {
  return (
    <section id={Section.HOME} className="min-h-screen flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-block glass-panel px-4 py-1.5 rounded-full">
              <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                OPEN TO COLLABORATION
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-gray-900 dark:text-white">
              Himel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-glitch cursor-default inline-block">
                Parvez
              </span>
            </h1>

            <div className="space-y-4">
              <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-mono flex flex-col md:flex-row gap-2 items-center justify-center lg:justify-start">
                 <span className="text-purple-600 dark:text-purple-500">&gt;</span>
                 <span className="animate-typewriter w-0">Android Developer & Engineer</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium dark:font-normal">
                Specializing in AOSP development, TWRP porting, and Vendor blobs integration. 
                Bringing life to <span className="text-gray-900 dark:text-white font-bold font-mono">sunstone</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => document.getElementById(Section.PROJECTS)?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold font-mono rounded-lg overflow-hidden transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 group-hover:text-white transition-colors">View Projects</span>
              </button>
              
              <a 
                href="https://github.com/himelpvz"
                target="_blank"
                rel="noreferrer"
                className="glass-panel px-8 py-3 rounded-lg font-mono font-bold text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Icons.Github className="w-5 h-5" />
                GitHub
              </a>
            </div>

            {/* Stats Row */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-200 dark:border-white/10">
              <div>
                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">{githubStats?.public_repos || 45}+</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 font-mono uppercase tracking-wider">Repositories</p>
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">{githubStats?.followers || 120}+</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 font-mono uppercase tracking-wider">Followers</p>
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">3+</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 font-mono uppercase tracking-wider">Years Exp</p>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg">
            {/* Holographic Card Effect */}
            <div className="relative z-10 glass-panel p-6 rounded-2xl bg-[#0d0d19] dark:bg-opacity-100 border-gray-800 shadow-2xl overflow-hidden group hover:scale-[1.01] transition-transform">
               {/* Animated Scan Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 blur-sm animate-float opacity-50 pointer-events-none"></div>

               {/* Terminal Header */}
               <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <div className="ml-auto text-xs text-gray-500 font-mono">himelpvz@archlinux:~</div>
               </div>
               
               {/* Terminal Content - Always Dark Mode for aesthetics */}
               <div className="font-mono text-sm space-y-2">
                 <div className="flex gap-2">
                    <span className="text-green-400">➜</span>
                    <span className="text-cyan-400">whoami</span>
                 </div>
                 <div className="text-gray-300 pl-4 mb-4">
                   Name: Himel Parvez<br/>
                   Role: System Architect<br/>
                   Location: Bangladesh
                 </div>

                 <div className="flex gap-2">
                    <span className="text-green-400">➜</span>
                    <span className="text-cyan-400">cat skills.json</span>
                 </div>
                 <div className="text-gray-300 pl-4">
                   [<br/>
                   &nbsp;&nbsp;"Android Bring-up",<br/>
                   &nbsp;&nbsp;"Kernel Tuning",<br/>
                   &nbsp;&nbsp;"TWRP Development",<br/>
                   &nbsp;&nbsp;"GitHub Actions CI/CD"<br/>
                   ]
                 </div>
               </div>

               {/* Decorative Elements */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
               <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
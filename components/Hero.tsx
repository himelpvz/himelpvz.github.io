import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { Section } from '../types';

interface HeroProps {
  githubStats: any;
}

// ----------------------------------------------------------------------------
// 1. Hacker Decryption Text Effect
// ----------------------------------------------------------------------------
const HackerText = ({ text, className = "" }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span className={`${className} font-display tracking-tight`}>
      {displayText}
    </span>
  );
};

// ----------------------------------------------------------------------------
// 2. Cycling Role Scroller
// ----------------------------------------------------------------------------
const roles = [
  "Android Developer",
  "Device Tree Engineer",
  "TWRP Maintainer",
  "Kernel Tweaker",
  "Open Source Contributor",
  "Sunstone Maintainer"
];

const RoleScroller = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 1000); // Changed to 1 second as requested
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 overflow-hidden relative inline-flex flex-col justify-center align-middle w-full md:w-auto">
      {roles.map((role, i) => (
        <span 
          key={role}
          className={`absolute transition-all duration-300 transform whitespace-nowrap ${
            i === index 
              ? 'translate-y-0 opacity-100 blur-0' 
              : 'translate-y-8 opacity-0 blur-sm'
          }`}
        >
          {role}
        </span>
      ))}
      <span className="invisible">placeholder</span>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 3. Random Quote Generator
// ----------------------------------------------------------------------------
const quotes = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Fix the cause, not the symptom.", author: "Steve Maguire" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Software is eating the world.", author: "Marc Andreessen" },
  { text: "It works on my machine.", author: "Anonymous" }
];

const RandomQuote = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Select random quote on mount
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="max-w-xl mx-auto lg:mx-0 min-h-[100px] flex flex-col justify-center animate-fade-in">
      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-mono border-l-4 border-cyan-500 pl-4 italic">
        "{quote.text}"
      </p>
      <p className="text-cyan-600 dark:text-cyan-400 text-xs font-bold font-display mt-2 pl-4 uppercase tracking-wider">
        — {quote.author}
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 4. Dynamic Terminal Content Cycler
// ----------------------------------------------------------------------------
const TerminalCycler = () => {
  const [index, setIndex] = useState(0);

  const terminalScreens = [
    {
      cmd: "neofetch",
      output: (
        <div className="text-gray-700 dark:text-gray-300 pl-4 flex gap-4 animate-fade-in">
           <div className="text-cyan-600 dark:text-cyan-500 text-xs leading-tight select-none hidden sm:block font-bold">
             {`
  /\\
 /  \\
/    \\
\\    /
 \\  /
  \\/
             `}
           </div>
           <div className="text-xs">
             <span className="text-cyan-600 dark:text-cyan-500">OS</span>: Android 14 (AOSP)<br/>
             <span className="text-cyan-600 dark:text-cyan-500">Host</span>: Xiaomi Redmi Note 12<br/>
             <span className="text-cyan-600 dark:text-cyan-500">Kernel</span>: 4.19.x-perf<br/>
             <span className="text-cyan-600 dark:text-cyan-500">Uptime</span>: 24/7<br/>
             <span className="text-cyan-600 dark:text-cyan-500">Shell</span>: zsh 5.8
           </div>
        </div>
      )
    },
    {
      cmd: "mka recoveryimage",
      output: (
        <div className="text-gray-600 dark:text-gray-400 pl-4 text-xs font-mono whitespace-pre-wrap animate-fade-in">
          [ 88%] <span className="text-green-600 dark:text-green-400">Compiling C object</span> kernel/sched/core.o<br/>
          [ 92%] <span className="text-yellow-600 dark:text-yellow-400">Linking static lib</span> lib/libart.a<br/>
          [ 95%] <span className="text-cyan-600 dark:text-cyan-400">Generating image</span> recovery.img<br/>
          <span className="text-green-600 dark:text-green-500">#### build completed successfully ####</span>
        </div>
      )
    },
    {
      cmd: "fastboot getvar all",
      output: (
        <div className="text-gray-700 dark:text-gray-300 pl-4 text-xs font-mono animate-fade-in">
          (bootloader) product: sunstone<br/>
          (bootloader) secure: no<br/>
          (bootloader) unlocked: yes<br/>
          (bootloader) battery-soc-ok: yes<br/>
          <span className="text-gray-500 dark:text-gray-500">Finished. Total time: 0.002s</span>
        </div>
      )
    },
    {
      cmd: "git push origin sunstone",
      output: (
        <div className="text-gray-700 dark:text-gray-300 pl-4 text-xs font-mono animate-fade-in">
          Enumerating objects: 15, done.<br/>
          Counting objects: 100% (15/15), done.<br/>
          Writing objects: 100% (8/8), 1.24 KiB, done.<br/>
          <span className="text-green-600 dark:text-green-400">remote: Resolving deltas: 100% (4/4)</span><br/>
          To github.com:himelpvz/device_xiaomi_sunstone.git
        </div>
      )
    },
    {
      cmd: "adb logcat | grep -i 'avb'",
      output: (
        <div className="text-gray-500 dark:text-gray-500 pl-4 text-[10px] font-mono whitespace-nowrap overflow-hidden animate-fade-in">
          I/init  (    1): [libfs_avb] returning 0<br/>
          W/libc  (  520): [avb_slot_verify.c:452] <span className="text-yellow-600 dark:text-yellow-500">Verification disabled</span><br/>
          I/init  (    1): [libfs_avb] AVB 2.0 scrub<br/>
          D/AndroidRuntime( 1200): Shutting down VM
        </div>
      )
    }
  ];

  useEffect(() => {
    // Change screen randomly every 1 second
    const interval = setInterval(() => {
      setIndex(prev => {
        let next;
        // Ensure we don't repeat the same screen immediately
        do {
           next = Math.floor(Math.random() * terminalScreens.length);
        } while (next === prev && terminalScreens.length > 1);
        return next;
      });
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  const currentScreen = terminalScreens[index];

  return (
    <div className="font-mono text-sm space-y-3 min-h-[160px]">
      {/* Static Part */}
      <div className="flex gap-2">
        <span className="text-green-600 dark:text-green-400">➜</span>
        <span className="text-cyan-600 dark:text-cyan-400">whoami</span>
      </div>
      <div className="text-gray-700 dark:text-gray-300 pl-4 mb-4 border-l-2 border-gray-300 dark:border-gray-700">
        Name: Himel Parvez<br/>
        Role: System Architect<br/>
        Target: sunstone
      </div>

      {/* Dynamic Part */}
      <div className="flex gap-2">
        <span className="text-green-600 dark:text-green-400">➜</span>
        <span className="text-cyan-600 dark:text-cyan-400">{currentScreen.cmd}</span>
      </div>
      {currentScreen.output}
    </div>
  );
};


// ----------------------------------------------------------------------------
// Main Hero Component
// ----------------------------------------------------------------------------
const Hero: React.FC<HeroProps> = ({ githubStats }) => {
  return (
    <section id={Section.HOME} className="min-h-screen flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-block glass-panel px-4 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10">
              <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm tracking-wider flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                OPEN TO COLLABORATION
              </span>
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-gray-900 dark:text-white mb-2">
                <HackerText text="HIMEL PARVEZ" className="bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-text-gradient bg-[length:200%_auto]" />
              </h1>
              
              <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-mono flex items-center justify-center lg:justify-start gap-2 h-8">
                 <span className="text-purple-600 dark:text-purple-500 font-bold">&gt;</span>
                 <RoleScroller />
                 <span className="animate-pulse w-2 h-5 bg-cyan-500/50 inline-block ml-1"></span>
              </div>
            </div>

            {/* Replaced static description with Random Quote */}
            <RandomQuote />

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => window.location.hash = '#/projects'}
                className="group relative px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold font-mono rounded-lg overflow-hidden transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                  View Projects <Icons.ExternalLink size={16} />
                </span>
              </button>
              
              <a 
                href="https://github.com/himelpvz"
                target="_blank"
                rel="noreferrer"
                className="glass-panel px-8 py-3 rounded-lg font-mono font-bold text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-2 group"
              >
                <Icons.Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                GitHub
              </a>
            </div>

            {/* Stats Row */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-200 dark:border-white/10">
              <StatItem value={`${githubStats?.public_repos || 45}+`} label="Repositories" delay="0s" />
              <StatItem value={`${githubStats?.followers || 120}+`} label="Followers" delay="0.1s" />
              <StatItem value="3+" label="Years Exp" delay="0.2s" />
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg">
            {/* Holographic Card Effect */}
            <div className="relative z-10 glass-panel p-6 rounded-2xl bg-slate-50 dark:bg-[#0d0d19] dark:bg-opacity-100 border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
               {/* Animated Scan Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 blur-sm animate-float opacity-50 pointer-events-none"></div>

               {/* Terminal Header */}
               <div className="flex items-center gap-2 mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <div className="ml-auto text-xs text-gray-500 font-mono">himelpvz@archlinux:~</div>
               </div>
               
               {/* Dynamic Terminal Content */}
               <TerminalCycler />

               {/* Decorative Elements */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
               <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ value, label, delay }: { value: string, label: string, delay: string }) => (
  <div className="animate-fade-in" style={{ animationDelay: delay }}>
    <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-500 font-mono uppercase tracking-wider">{label}</p>
  </div>
);

export default Hero;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Icons } from './Icons';

const TopBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/skills': return 'Skills';
      case '/projects': return 'Projects';
      case '/releases': return 'Releases';
      case '/devices': return 'Devices';
      default: return null;
    }
  };

  const title = getPageTitle();

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'py-2 bg-white/90 dark:bg-[#030014]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-sm' 
        : 'py-4 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {title ? (
          <div className="flex items-center gap-3 animate-fade-in">
             <Link to="/" className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
               {/* Android Back Arrow style */}
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 dark:text-white"><path d="m15 18-6-6 6-6"/></svg>
             </Link>
             <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-wide">{title}</h1>
          </div>
        ) : (
          <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center font-display font-bold text-white shadow-lg shadow-cyan-500/20">
                HP
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base leading-none tracking-wider text-gray-800 dark:text-white">
                  HIMEL<span className="text-cyan-600 dark:text-cyan-400">PVZ</span>
                </span>
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 leading-none mt-0.5">
                  SYSTEM_READY
                </span>
              </div>
          </Link>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
};

export default TopBar;
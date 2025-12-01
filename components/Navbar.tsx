import React, { useState, useEffect } from 'react';
import { Section } from '../types';
import { Icons } from './Icons';
import ThemeToggle from './ThemeToggle';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [active, setActive] = useState<Section>(Section.HOME);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      if (isHome) {
        const sections = Object.values(Section);
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= 300) {
              setActive(section);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNavClick = (id: string) => {
    if (!isHome) {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setActive(id as Section);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 md:py-4' : 'py-4 md:py-6'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`glass-panel rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-opacity-80 dark:bg-opacity-80' : 'bg-opacity-40 dark:bg-opacity-40'
        }`}>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick(Section.HOME)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-600 dark:from-cyan-500 dark:to-purple-600 flex items-center justify-center font-display font-bold text-xl text-white shadow-lg shadow-cyan-500/20">
              HP
            </div>
            <span className="hidden sm:block font-display font-bold text-lg tracking-wider text-gray-800 dark:text-white">
              HIMEL<span className="text-cyan-600 dark:text-cyan-400">PVZ</span>
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigate('/blog')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname.startsWith('/blog')
                    ? 'bg-black/5 dark:bg-white/10 text-cyan-700 dark:text-cyan-400 font-medium' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icons.Code className="w-4 h-4" />
                <span className="hidden lg:inline font-mono text-sm">Blog</span>
              </button>
              
              <button
                onClick={() => handleNavClick(Section.DEVICES)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  active === Section.DEVICES && isHome
                    ? 'bg-black/5 dark:bg-white/10 text-cyan-700 dark:text-cyan-400 font-medium' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icons.Smartphone className="w-4 h-4" />
                <span className="hidden lg:inline font-mono text-sm">Devices</span>
              </button>

              <button
                onClick={() => handleNavClick(Section.PROJECTS)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  active === Section.PROJECTS && isHome
                    ? 'bg-black/5 dark:bg-white/10 text-cyan-700 dark:text-cyan-400 font-medium' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icons.Github className="w-4 h-4" />
                <span className="hidden lg:inline font-mono text-sm">GitHub</span>
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              
              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center justify-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                title="Admin Panel"
              >
                <Icons.Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
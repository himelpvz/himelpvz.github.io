import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Icons } from './Icons';

type DesignStyle = 'glass' | 'material' | 'neomorphism' | 'neobrutalism';

const TopBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<DesignStyle>('glass');
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load saved style
    const savedStyle = localStorage.getItem('designStyle') as DesignStyle;
    if (savedStyle) {
      applyStyle(savedStyle);
    } else {
      // Default
      document.documentElement.setAttribute('data-style', 'glass');
    }

    // Click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const applyStyle = (style: DesignStyle) => {
    setCurrentStyle(style);
    localStorage.setItem('designStyle', style);
    document.documentElement.setAttribute('data-style', style);
    setIsMenuOpen(false);
  };

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
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200"
            >
              <Icons.MoreVertical size={22} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-56 glass-panel rounded-2xl shadow-2xl p-2 flex flex-col gap-1 z-50 overflow-hidden origin-top-right animate-fade-in border border-gray-200 dark:border-white/10">
                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Select UI Style
                </div>
                
                <StyleOption 
                  label="Glassmorphism" 
                  active={currentStyle === 'glass'} 
                  onClick={() => applyStyle('glass')}
                  icon={<Icons.Layers size={16} />}
                />
                <StyleOption 
                  label="Material 3" 
                  active={currentStyle === 'material'} 
                  onClick={() => applyStyle('material')}
                  icon={<Icons.Palette size={16} />}
                />
                <StyleOption 
                  label="Neomorphism" 
                  active={currentStyle === 'neomorphism'} 
                  onClick={() => applyStyle('neomorphism')}
                  icon={<Icons.Box size={16} />}
                />
                <StyleOption 
                  label="Neo-Brutalism" 
                  active={currentStyle === 'neobrutalism'} 
                  onClick={() => applyStyle('neobrutalism')}
                  icon={<Icons.Square size={16} />}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

const StyleOption = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active 
        ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
    {active && <div className="ml-auto w-2 h-2 rounded-full bg-cyan-500"></div>}
  </button>
);

export default TopBar;
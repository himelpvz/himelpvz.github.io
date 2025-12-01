import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import ThemeToggle from './ThemeToggle';
import { useLocation, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 md:py-4' : 'py-4 md:py-6'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`glass-panel rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-opacity-80 dark:bg-opacity-80' : 'bg-opacity-40 dark:bg-opacity-40'
        }`}>
          
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-600 dark:from-cyan-500 dark:to-purple-600 flex items-center justify-center font-display font-bold text-xl text-white shadow-lg shadow-cyan-500/20">
              HP
            </div>
            <span className="hidden sm:block font-display font-bold text-lg tracking-wider text-gray-800 dark:text-white">
              HIMEL<span className="text-cyan-600 dark:text-cyan-400">PVZ</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
            <NavLink to="/skills" icon={<Icons.Terminal className="w-4 h-4" />} label="Skills" active={isActive('/skills')} />
            <NavLink to="/devices" icon={<Icons.Smartphone className="w-4 h-4" />} label="Devices" active={isActive('/devices')} />
            <NavLink to="/projects" icon={<Icons.Github className="w-4 h-4" />} label="Projects" active={isActive('/projects')} />
            <NavLink to="/releases" icon={<Icons.HardDrive className="w-4 h-4" />} label="Releases" active={isActive('/releases')} />
            
            <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-2 hidden sm:block"></div>
            
            <ThemeToggle />
          </div>

        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
      active
        ? 'bg-black/5 dark:bg-white/10 text-cyan-700 dark:text-cyan-400 font-medium' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="hidden lg:inline font-mono text-sm">{label}</span>
  </Link>
);

export default Navbar;
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Icons } from './Icons';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-4 sm:pb-6 px-4">
      <div className="container mx-auto max-w-md pointer-events-auto">
        <div className="glass-panel rounded-2xl p-1.5 flex items-center justify-between bg-[#ffffff]/90 dark:bg-[#0d0d19]/90 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5">
          <NavItem to="/" icon={<Icons.Home size={22} />} label="Home" active={isActive('/')} />
          <NavItem to="/skills" icon={<Icons.Terminal size={22} />} label="Skills" active={isActive('/skills')} />
          <NavItem to="/devices" icon={<Icons.Smartphone size={22} />} label="Devices" active={isActive('/devices')} />
          <NavItem to="/projects" icon={<Icons.Github size={22} />} label="Projs" active={isActive('/projects')} />
          <NavItem to="/releases" icon={<Icons.HardDrive size={22} />} label="Rel" active={isActive('/releases')} />
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`relative flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl transition-all duration-300 w-full group ${
      active
        ? 'text-cyan-600 dark:text-cyan-400'
        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
    }`}
  >
    {/* Active Background Glow */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-cyan-500/0 rounded-xl" />
    )}
    
    {/* Active Indicator Dot (Android Style) */}
    {active && (
       <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-500 rounded-b-full shadow-[0_2px_8px_rgba(6,182,212,0.6)]"></div>
    )}

    <div className={`transition-transform duration-300 ${active ? '-translate-y-0.5 scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'group-hover:scale-105'}`}>
      {icon}
    </div>
    
    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
      active ? 'opacity-100 translate-y-0' : 'opacity-70 scale-90'
    }`}>
      {label}
    </span>
  </Link>
);

export default Navbar;
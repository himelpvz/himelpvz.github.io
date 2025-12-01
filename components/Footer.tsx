import React from 'react';
import { Icons } from './Icons';
import { Section } from '../types';

const Footer: React.FC = () => {
  return (
    <footer id={Section.CONTACT} className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#020010] relative overflow-hidden transition-colors duration-500">
      
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-200/20 dark:bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Himel Parvez</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-mono max-w-xs">
              Building the future of Android customization, one commit at a time.
            </p>
          </div>

          <div className="flex gap-4">
             <SocialLink href="https://github.com/himelpvz" icon={<Icons.Github size={20} />} label="GitHub" />
             <SocialLink href="https://t.me/Himel_Pvz" icon={<Icons.Telegram size={20} />} label="Telegram" />
             <SocialLink href="mailto:himelparvez39@gmail.com" icon={<Icons.Mail size={20} />} label="Email" />
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-600 font-mono">
          <p>© {new Date().getFullYear()} Himel Parvez. All rights reserved.</p>
          <p className="flex items-center gap-2 mt-2 md:mt-0">
            <Icons.Code size={12} />
            Built with React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noreferrer"
    className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:scale-110 transition-all duration-300 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 shadow-sm"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
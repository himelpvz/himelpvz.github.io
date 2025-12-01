import React from 'react';
import { GitHubRepo, Section } from '../types';
import { Icons } from './Icons';

interface GitHubSectionProps {
  repos: GitHubRepo[];
}

const GitHubSection: React.FC<GitHubSectionProps> = ({ repos }) => {
  const featuredRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  return (
    <section id={Section.PROJECTS} className="py-20 relative">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col items-center mb-16 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-mono mb-4">
             <Icons.GitBranch size={14} />
             <span>OPEN SOURCE</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 dark:text-white">
             GitHub <span className="text-gradient">Activity</span>
           </h2>
        </div>

        <div className="w-full max-w-4xl mx-auto mb-16 glass-panel p-2 rounded-xl overflow-hidden bg-white/50 dark:bg-black/20">
             <div className="w-full overflow-x-auto">
               <img 
                 src="https://raw.githubusercontent.com/himelpvz/himelpvz/output/github-contribution-grid-snake.svg" 
                 alt="GitHub Contribution Animation" 
                 className="w-full min-w-[600px] h-auto dark:invert-0 invert opacity-80 dark:opacity-100"
                 onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                 }}
               />
               <div className="p-4 text-center text-gray-500 text-sm font-mono">
                  Daily Contribution Graph (Live Sync)
               </div>
             </div>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredRepos.map((repo) => (
            <a 
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group glass-card glass-panel p-6 rounded-2xl flex flex-col transition-all duration-300 h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                <Icons.Github size={100} className="text-gray-900 dark:text-white" />
              </div>

              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                    <Icons.Layers size={20} />
                    <span className="font-mono text-xs border border-cyan-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20">
                      {repo.language || 'Config'}
                    </span>
                 </div>
                 <Icons.ExternalLink size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                {repo.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                {repo.description || "No description available. Check the code for details."}
              </p>

              <div className="flex items-center gap-6 text-sm font-mono text-gray-500 mt-auto">
                <div className="flex items-center gap-1.5">
                  <Icons.Star size={14} className="text-yellow-600 dark:text-yellow-500" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icons.GitBranch size={14} className="text-purple-600 dark:text-purple-500" />
                  <span>{repo.forks_count}</span>
                </div>
                <div className="text-xs ml-auto">
                  {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="https://github.com/himelpvz?tab=repositories"
            target="_blank"
            rel="noreferrer" 
            className="inline-flex items-center gap-2 text-gray-700 dark:text-white border-b border-cyan-500 pb-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-mono"
          >
            View all repositories <Icons.ExternalLink size={14} />
          </a>
        </div>

      </div>
    </section>
  );
};

export default GitHubSection;
import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';
import { fetchLatestReleases, Release } from '../services/githubService';

const Releases: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReleases = async () => {
      const data = await fetchLatestReleases();
      setReleases(data);
      setLoading(false);
    };
    getReleases();
  }, []);

  return (
    <section className="py-20 relative border-t border-gray-200 dark:border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 text-xs font-mono mb-4">
             <Icons.HardDrive size={14} />
             <span>LATEST DEPLOYMENTS</span>
           </div>
           <h2 className="text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">
             My <span className="text-gradient">Releases</span>
           </h2>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
             <p className="text-gray-500 font-mono text-sm">Fetching latest artifacts...</p>
           </div>
        ) : releases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {releases.map((release) => (
              <div key={release.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icons.Settings size={80} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-xs font-mono">
                      {release.repo_name}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(release.published_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {release.name || release.tag_name}
                  </h3>

                  <div className="prose prose-invert prose-sm mb-6 max-h-32 overflow-hidden text-gray-500 dark:text-gray-400">
                    {release.body ? (release.body.substring(0, 150) + (release.body.length > 150 ? '...' : '')) : "View full release notes on GitHub."}
                  </div>

                  <a 
                    href={release.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm hover:scale-105 transition-transform"
                  >
                    <Icons.ExternalLink size={16} /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.Layers className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Releases Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              It seems there are no published releases in the most active repositories yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Releases;
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {releases.map((release) => (
              <div 
                key={release.id} 
                className="bg-[#1e1e1e] rounded-xl overflow-hidden font-mono text-sm shadow-2xl border border-gray-800 flex flex-col h-full group transition-all duration-300 hover:-translate-y-2 hover:shadow-cyan-500/10"
              >
                {/* Terminal Header */}
                <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-gray-700">
                   <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                   </div>
                   <div className="text-gray-400 text-xs flex items-center gap-2 opacity-70">
                     <Icons.Terminal size={12} />
                     bash — {release.repo_name}
                   </div>
                   <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                {/* Terminal Body */}
                <div className="p-6 text-gray-300 flex-1 flex flex-col bg-[#1e1e1e]">
                    {/* Command Line Simulation */}
                    <div className="flex flex-wrap gap-2 mb-6 font-bold">
                        <span className="text-green-500">➜</span>
                        <span className="text-cyan-500">~</span>
                        <span className="text-gray-300">gh release view</span>
                        <span className="text-yellow-400">{release.tag_name}</span>
                        <span className="text-gray-500">--json body</span>
                    </div>

                    {/* Output Area */}
                    <div className="pl-2 border-l-2 border-gray-700 mb-6 space-y-3 flex-1">
                         <div className="flex gap-4">
                             <span className="text-purple-400 w-20 shrink-0">Repository:</span>
                             <span className="text-gray-200">{release.repo_name}</span>
                         </div>
                         <div className="flex gap-4">
                             <span className="text-purple-400 w-20 shrink-0">Published:</span>
                             <span className="text-gray-200">{new Date(release.published_at).toLocaleDateString()}</span>
                         </div>
                         <div className="flex gap-4">
                             <span className="text-purple-400 w-20 shrink-0">Version:</span>
                             <span className="text-green-400 font-bold">{release.name || release.tag_name}</span>
                         </div>
                         
                         <div className="pt-4 text-gray-400 text-xs leading-relaxed opacity-80 line-clamp-4 whitespace-pre-line">
                            {release.body ? release.body : "// No changelog provided for this release."}
                         </div>
                    </div>

                    {/* Action Area */}
                    <div className="mt-auto pt-4 border-t border-gray-800 border-dashed">
                        <div className="flex items-center justify-between">
                           <span className="animate-pulse text-green-500 text-xs">_waiting for input...</span>
                           <a 
                             href={release.html_url}
                             target="_blank"
                             rel="noreferrer"
                             className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 text-cyan-400 px-4 py-2 rounded transition-all duration-300 text-xs font-bold uppercase tracking-wider group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                           >
                              <Icons.ExternalLink size={14} />
                              ./download.sh
                           </a>
                        </div>
                    </div>
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
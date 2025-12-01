import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { BlogPost } from '../types';
import { getPosts } from '../services/blogService';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-mono">
            <Icons.Code size={14} />
            <span>DEV LOGS & TUTORIALS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
            Engineering <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg">
            Deep dives into Android internals, Kernel development, and System architecture.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icons.Layers className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 font-mono"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col h-full">
              <div className="glass-panel p-1 rounded-2xl h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-cyan-500/10">
                <div className="bg-white dark:bg-[#0a0a0f] rounded-xl overflow-hidden h-full flex flex-col">
                  
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                       {post.tags.slice(0, 2).map(tag => (
                         <span key={tag} className="px-2 py-0.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-100 text-xs font-mono">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4 mt-auto">
                       <div className="flex gap-4 text-xs font-bold text-gray-500">
                         <span className="flex items-center gap-1"><Icons.Star size={12} className="text-yellow-500" /> {post.likes}</span>
                       </div>
                       <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                         Read More <Icons.ExternalLink size={12} />
                       </span>
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 font-mono">
            No posts found matching your search.
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;
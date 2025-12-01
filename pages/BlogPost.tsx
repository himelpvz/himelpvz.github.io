import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icons } from '../components/Icons';
import { getPostById, toggleReaction, getUserReaction } from '../services/blogService';
import { BlogPost as BlogPostType } from '../types';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | undefined>(undefined);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      setPost(foundPost);
      setUserReaction(getUserReaction(id));
    }
  }, [id]);

  const handleReaction = (type: 'like' | 'dislike') => {
    if (!id || !post) return;
    
    toggleReaction(id, type);
    setUserReaction(prev => prev === type ? null : type);
    
    // Refresh post data to show updated counts (simulated)
    const updatedPost = getPostById(id);
    if (updatedPost) setPost(updatedPost);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 font-mono">
        Loading or Post Not Found...
      </div>
    );
  }

  return (
    <article className="pt-24 pb-20 min-h-screen">
      
      {/* Hero Header */}
      <div className="w-full h-[400px] relative mb-12">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-[#030014] to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
          <div className="container mx-auto">
             <Link to="/blog" className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-sm mb-4 hover:underline">
               <Icons.GitBranch className="rotate-180" size={14} /> Back to Blog
             </Link>
             <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white max-w-4xl leading-tight mb-4">
               {post.title}
             </h1>
             <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-gray-600 dark:text-gray-300">
               <span className="bg-white/50 dark:bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                 {post.date}
               </span>
               <span className="flex items-center gap-2">
                 By <span className="font-bold text-cyan-600 dark:text-cyan-400">{post.author}</span>
               </span>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        
        {/* Main Content */}
        <div className="glass-panel p-6 md:p-10 rounded-2xl bg-white/50 dark:bg-[#0a0a0f]/50">
           <div className="markdown-content font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
           </div>

           {/* Reactions */}
           <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col items-center">
             <h3 className="font-display font-bold text-lg mb-4 text-gray-900 dark:text-white">Did you find this helpful?</h3>
             <div className="flex gap-4">
               <button 
                 onClick={() => handleReaction('like')}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                   userReaction === 'like' 
                     ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105' 
                     : 'bg-gray-100 dark:bg-white/5 hover:bg-green-100 dark:hover:bg-green-900/20 text-gray-600 dark:text-gray-300'
                 }`}
               >
                 <Icons.Star className={userReaction === 'like' ? 'fill-current' : ''} size={20} />
                 <span className="font-mono font-bold">{post.likes}</span>
               </button>
               
               <button 
                 onClick={() => handleReaction('dislike')}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                   userReaction === 'dislike' 
                     ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105' 
                     : 'bg-gray-100 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300'
                 }`}
               >
                 <Icons.Terminal size={20} />
                 <span className="font-mono font-bold">{post.dislikes}</span>
               </button>
             </div>
           </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-xl bg-white/50 dark:bg-[#0a0a0f]/50 sticky top-24">
             <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
             <div className="flex flex-wrap gap-2">
               {post.tags.map(tag => (
                 <span key={tag} className="px-3 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-bold border border-cyan-200 dark:border-cyan-500/30">
                   #{tag}
                 </span>
               ))}
             </div>
          </div>
        </div>

      </div>
    </article>
  );
};

export default BlogPost;
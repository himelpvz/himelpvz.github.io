import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import MarkdownEditor from '../components/MarkdownEditor';
import { createPost, updatePost, deletePost, getPosts, getBlogStats } from '../services/blogService';
import { BlogPost } from '../types';
import { useNavigate } from 'react-router-dom';

// 🔒 SECURITY CONFIGURATION
// Since this is a client-side app (no backend), we use a hardcoded key.
// CHANGE THIS VALUE below to something secret before deploying!
const ADMIN_ACCESS_KEY = "admin123";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [loginKey, setLoginKey] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Dashboard Data
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalLikes: 0, totalViews: 0 });

  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    coverImage: '',
    tags: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    // Check for existing session
    const session = sessionStorage.getItem('admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = () => {
    setPosts(getPosts());
    setStats(getBlogStats());
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      if (loginKey === ADMIN_ACCESS_KEY) {
        sessionStorage.setItem('admin_session', 'true');
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setLoginError('Invalid Access Key. Access Denied.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setLoginKey('');
  };

  const startNewPost = () => {
    setEditingId(null);
    setFormData({
      title: '',
      coverImage: '',
      tags: '',
      excerpt: '',
      content: '# New Post\n\nWrite something amazing...'
    });
    setView('editor');
  };

  const startEditPost = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      coverImage: post.coverImage,
      tags: post.tags.join(', '),
      excerpt: post.excerpt,
      content: post.content
    });
    setView('editor');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      deletePost(id);
      loadDashboardData();
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert('Title and Content are required fields.');
      return;
    }

    const postData = {
      title: formData.title,
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      excerpt: formData.excerpt || formData.content.substring(0, 100) + '...',
      content: formData.content
    };

    if (editingId) {
      updatePost(editingId, postData);
    } else {
      createPost(postData);
    }

    loadDashboardData();
    setView('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-gray-50 dark:bg-[#030014]">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
          
          <div className="w-20 h-20 bg-gray-900 dark:bg-white rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Icons.Settings size={40} className="text-white dark:text-black -rotate-3" />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Admin Portal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-mono text-sm">
            Restricted Area. Authorized Personnel Only.
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Icons.Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="Enter Access Key"
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-cyan-500 transition-colors dark:text-white font-mono"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-xs font-bold bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Authenticate <Icons.ExternalLink size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-400 font-mono">
            Key: <span className="bg-gray-100 dark:bg-white/10 px-1 rounded select-all">admin123</span> (Dev Mode)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-gray-50 dark:bg-[#030014] flex">
      <div className="container mx-auto max-w-7xl flex gap-6">
        
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 glass-panel rounded-2xl h-[calc(100vh-8rem)] sticky top-24 p-4">
          <div className="flex items-center gap-3 px-4 py-4 mb-6 border-b border-gray-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500"></div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Himel Parvez</h3>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <SidebarItem 
              icon={<Icons.Layers size={18} />} 
              label="Dashboard" 
              active={view === 'dashboard'} 
              onClick={() => setView('dashboard')} 
            />
            <SidebarItem 
              icon={<Icons.Code size={18} />} 
              label="New Article" 
              active={view === 'editor' && !editingId} 
              onClick={startNewPost} 
            />
            <SidebarItem 
              icon={<Icons.ExternalLink size={18} />} 
              label="View Site" 
              onClick={() => navigate('/')} 
            />
          </div>

          <div className="mt-auto">
            <SidebarItem 
              icon={<span className="rotate-180 inline-block"><Icons.ExternalLink size={18} /></span>} 
              label="Logout" 
              onClick={handleLogout} 
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          
          {view === 'dashboard' ? (
            <div className="space-y-6 animate-fade-in">
              <header className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Overview</h1>
                <div className="flex gap-2 lg:hidden">
                   <button onClick={startNewPost} className="p-2 bg-cyan-600 rounded-lg text-white shadow-lg shadow-cyan-500/30">
                     <Icons.Code size={20} />
                   </button>
                   <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                     <Icons.Settings size={20} />
                   </button>
                </div>
              </header>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Posts" value={stats.totalPosts} icon={<Icons.Layers />} color="text-blue-500" />
                <StatCard label="Total Likes" value={stats.totalLikes} icon={<Icons.Star />} color="text-yellow-500" />
                <StatCard label="Est. Views" value={stats.totalViews} icon={<Icons.ExternalLink />} color="text-purple-500" />
              </div>

              {/* Posts Table */}
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white">Recent Articles</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-white/5 text-xs font-mono text-gray-500 uppercase">
                      <tr>
                        <th className="px-6 py-3 text-left">Title</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                      {posts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{post.title}</div>
                            <div className="text-xs text-gray-500 font-mono">ID: {post.id}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">{post.date}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-500/20">
                              Published
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => startEditPost(post)} className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors" title="Edit">
                                <Icons.Settings size={16} />
                              </button>
                              <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                <Icons.Terminal size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-mono text-sm">
                            No posts yet. Start writing!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in h-full flex flex-col">
              <header className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <Icons.GitBranch className="rotate-180" />
                  </button>
                  <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                    {editingId ? 'Edit Article' : 'New Article'}
                  </h1>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Icons.Send size={16} /> Publish
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <input 
                    type="text" 
                    placeholder="Article Title"
                    className="w-full bg-transparent text-3xl font-display font-bold border-b border-gray-200 dark:border-white/10 pb-2 outline-none text-gray-900 dark:text-white placeholder-gray-400 focus:border-cyan-500 transition-colors"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                  
                  <MarkdownEditor 
                    value={formData.content} 
                    onChange={val => setFormData({...formData, content: val})} 
                    className="min-h-[600px] shadow-sm"
                  />
                </div>

                <div className="space-y-6">
                  <div className="glass-panel p-5 rounded-xl space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Icons.Settings size={16} /> Metadata
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1">COVER IMAGE URL</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        className="w-full bg-gray-50 dark:bg-black/20 p-2.5 rounded-lg border border-gray-200 dark:border-white/10 outline-none text-sm focus:border-cyan-500 transition-colors dark:text-gray-300"
                        value={formData.coverImage}
                        onChange={e => setFormData({...formData, coverImage: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1">TAGS (COMMA SEPARATED)</label>
                      <input 
                        type="text" 
                        placeholder="android, kernel, guide"
                        className="w-full bg-gray-50 dark:bg-black/20 p-2.5 rounded-lg border border-gray-200 dark:border-white/10 outline-none text-sm focus:border-cyan-500 transition-colors dark:text-gray-300"
                        value={formData.tags}
                        onChange={e => setFormData({...formData, tags: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-500 mb-1">EXCERPT</label>
                      <textarea 
                        placeholder="Brief description for the card..."
                        className="w-full bg-gray-50 dark:bg-black/20 p-2.5 rounded-lg border border-gray-200 dark:border-white/10 outline-none text-sm resize-none h-24 focus:border-cyan-500 transition-colors dark:text-gray-300"
                        value={formData.excerpt}
                        onChange={e => setFormData({...formData, excerpt: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, className = '' }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
      active 
        ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 shadow-sm' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
    } ${className}`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="glass-panel p-5 rounded-xl flex items-center gap-4 transition-transform hover:scale-105 duration-300">
    <div className={`w-12 h-12 rounded-full ${color.replace('text-', 'bg-')}/10 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-2xl font-bold font-display text-gray-900 dark:text-white">{value}</h4>
      <p className="text-xs text-gray-500 uppercase font-mono">{label}</p>
    </div>
  </div>
);

export default Admin;
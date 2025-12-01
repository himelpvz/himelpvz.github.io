import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icons } from '../components/Icons';
import { createPost } from '../services/blogService';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('# Hello World\nStart writing your article here...');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    // Check session
    const session = sessionStorage.getItem('admin_session');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setIsGithubLoading(true);
    // Simulate GitHub OAuth delay
    setTimeout(() => {
      sessionStorage.setItem('admin_session', 'true');
      setIsAuthenticated(true);
      setIsGithubLoading(false);
    }, 1500);
  };

  const handlePublish = () => {
    if (!title || !content) return alert('Title and Content are required');
    
    createPost({
      title,
      coverImage: coverImage || 'https://via.placeholder.com/800x400',
      tags: tags.split(',').map(t => t.trim()),
      excerpt: excerpt || content.substring(0, 100) + '...',
      content
    });

    alert('Post published successfully!');
    navigate('/blog');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.Github size={32} className="text-white dark:text-black" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Admin Access</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Please authenticate with GitHub to manage your blog content.
          </p>
          <button 
            onClick={handleLogin}
            disabled={isGithubLoading}
            className="w-full py-3 bg-[#24292e] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#1b1f23] transition-colors disabled:opacity-50"
          >
            {isGithubLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Icons.Github size={20} />
            )}
            Sign in with GitHub
          </button>
          <p className="mt-4 text-xs text-gray-400">
            *This is a client-side simulation for demo purposes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">New Article</h1>
          <button 
             onClick={handlePublish}
             className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
          >
            <Icons.Send size={16} /> Publish
          </button>
        </div>

        <div className="grid gap-6">
           {/* Meta Data */}
           <div className="glass-panel p-6 rounded-xl space-y-4">
              <input 
                type="text" 
                placeholder="Article Title"
                className="w-full bg-transparent text-2xl font-bold border-b border-gray-200 dark:border-white/10 pb-2 outline-none text-gray-900 dark:text-white placeholder-gray-500"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Cover Image URL"
                  className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-white/10 outline-none text-gray-900 dark:text-white text-sm"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Tags (comma separated)"
                  className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-white/10 outline-none text-gray-900 dark:text-white text-sm"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
              <textarea 
                placeholder="Short Excerpt (SEO)"
                className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-white/10 outline-none text-gray-900 dark:text-white text-sm h-20 resize-none"
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
              />
           </div>

           {/* Editor */}
           <div className="glass-panel p-1 rounded-xl min-h-[500px] flex flex-col bg-white dark:bg-[#0a0a0f]">
              <div className="flex border-b border-gray-200 dark:border-white/10">
                <button 
                  onClick={() => setActiveTab('write')}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'write' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Write
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'preview' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Preview
                </button>
              </div>

              <div className="flex-1 relative">
                {activeTab === 'write' ? (
                  <textarea 
                    className="w-full h-full p-6 bg-transparent outline-none text-gray-800 dark:text-gray-200 font-mono text-sm resize-none min-h-[500px]"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    spellCheck={false}
                  />
                ) : (
                  <div className="w-full h-full p-6 overflow-y-auto markdown-content min-h-[500px]">
                    <h1 className="text-3xl font-bold mb-4">{title}</h1>
                    {coverImage && <img src={coverImage} alt="Cover" className="w-full h-64 object-cover rounded-xl mb-6" />}
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Devices from '../components/Devices';
import GitHubSection from '../components/GitHubSection';
import Skills from '../components/Skills';
import { fetchProfile, fetchRepos, fallbackProfile } from '../services/githubService';
import { GitHubUser, GitHubRepo } from '../types';

const Home: React.FC = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, repoData] = await Promise.all([
          fetchProfile(),
          fetchRepos()
        ]);
        setUser(userData || fallbackProfile);
        setRepos(repoData);
      } catch (e) {
        setUser(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030014] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
           <p className="text-cyan-500 font-mono text-sm animate-pulse">Initializing System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 animate-fade-in">
      <Hero githubStats={user} />
      
      <Skills />
      
      {/* Animated Divider */}
      <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>
      
      <Devices />
      
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50"></div>
      
      <GitHubSection repos={repos} />
    </div>
  );
};

export default Home;
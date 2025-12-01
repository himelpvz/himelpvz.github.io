import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { fetchProfile, fallbackProfile } from '../services/githubService';
import { GitHubUser } from '../types';

const Home: React.FC = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchProfile();
        setUser(userData || fallbackProfile);
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
    </div>
  );
};

export default Home;
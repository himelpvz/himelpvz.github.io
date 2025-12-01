import React, { useEffect, useState } from 'react';
import GitHubSection from '../components/GitHubSection';
import { fetchRepos } from '../services/githubService';
import { GitHubRepo } from '../types';

const ProjectsPage: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepos = async () => {
      const data = await fetchRepos();
      setRepos(data);
      setLoading(false);
    };
    loadRepos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-8 min-h-screen animate-fade-in">
      <GitHubSection repos={repos} />
    </div>
  );
};

export default ProjectsPage;
import { GitHubRepo, GitHubUser } from '../types';

const USERNAME = 'himelpvz';

export const fetchProfile = async (): Promise<GitHubUser | null> => {
  try {
    const response = await fetch(`https://api.github.com/users/${USERNAME}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchRepos = async (): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`);
    if (!response.ok) throw new Error('Failed to fetch repos');
    return await response.json();
  } catch (error) {
    console.error(error);
    // Return empty array on failure
    return [];
  }
};

// Fallback data in case API limit is reached
export const fallbackProfile: GitHubUser = {
  login: "himelpvz",
  avatar_url: "https://avatars.githubusercontent.com/u/76262529?v=4",
  html_url: "https://github.com/himelpvz",
  public_repos: 45,
  followers: 120,
  following: 10,
  bio: "Android Developer | Device Tree Engineer | TWRP Maintainer",
  name: "Himel Parvez"
};

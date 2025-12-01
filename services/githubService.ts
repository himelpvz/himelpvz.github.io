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

export interface Release {
  id: number;
  name: string;
  tag_name: string;
  published_at: string;
  html_url: string;
  body: string;
  repo_name: string;
}

export const fetchLatestReleases = async (): Promise<Release[]> => {
  try {
    // 1. Fetch the user's most recently updated repositories first
    const reposResponse = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=8`);
    
    if (!reposResponse.ok) {
      console.warn("Could not fetch repo list for releases check");
      return [];
    }
    
    const repos: GitHubRepo[] = await reposResponse.json();
    
    // 2. In parallel, check each of these repos for their 'latest' release
    // We map the fetch promises to process them concurrently
    const releasePromises = repos.map(async (repo) => {
      try {
        const releaseResp = await fetch(`https://api.github.com/repos/${USERNAME}/${repo.name}/releases/latest`);
        if (releaseResp.ok) {
          const data = await releaseResp.json();
          return { ...data, repo_name: repo.name } as Release;
        }
      } catch (e) {
        // Most repos wont have releases, so silent fail is fine
      }
      return null;
    });

    const results = await Promise.all(releasePromises);
    
    // 3. Filter out nulls and sort by publish date (newest first)
    const validReleases = results.filter((r): r is Release => r !== null);
    
    return validReleases.sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );

  } catch (error) {
    console.error("Error fetching releases:", error);
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
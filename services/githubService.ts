import { GitHubRepo, GitHubUser } from '../types';

const USERNAME = 'himelpvz';
const CACHE_PREFIX = 'hp_portfolio_cache_';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 Hour Cache Duration

// Singleton to hold static data if loaded
let staticData: any = null;

async function getStaticData() {
  if (staticData) return staticData;
  try {
    // Attempt to fetch the pre-generated JSON file (created during build)
    const response = await fetch('./github-data.json');
    if (response.ok) {
      staticData = await response.json();
      return staticData;
    }
  } catch (e) {
    // Ignore error, file might not exist in local dev
  }
  return null;
}

// 🛠️ Generic Caching Wrapper
async function getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T | null> {
  const cacheKey = CACHE_PREFIX + key;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    } catch (e) {
      console.warn("Error parsing cache", e);
    }
  }

  try {
    const data = await fetcher();
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.warn(`Fetch failed for ${key} (likely rate limit). Falling back to stale cache.`);
    
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch (e) { /* ignore */ }
    }
    
    throw error;
  }
}

// Fallback Data definitions
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

export const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 101,
    name: "android_device_xiaomi_sunstone",
    description: "Device tree configuration for Redmi Note 12 5G (sunstone)",
    html_url: "https://github.com/himelpvz/android_device_xiaomi_sunstone",
    stargazers_count: 45,
    forks_count: 12,
    language: "Makefile",
    updated_at: new Date().toISOString(),
    topics: ["android", "twrp", "recovery"],
    homepage: null
  },
  {
    id: 102,
    name: "android_vendor_xiaomi_sunstone",
    description: "Vendor blobs for Redmi Note 12 5G",
    html_url: "https://github.com/himelpvz/android_vendor_xiaomi_sunstone",
    stargazers_count: 20,
    forks_count: 8,
    language: "Shell",
    updated_at: new Date().toISOString(),
    topics: ["vendor", "blobs"],
    homepage: null
  },
  {
    id: 103,
    name: "kernel_xiaomi_sunstone",
    description: "Custom kernel source for Snapdragon 4 Gen 1",
    html_url: "https://github.com/himelpvz/kernel_xiaomi_sunstone",
    stargazers_count: 35,
    forks_count: 10,
    language: "C",
    updated_at: new Date().toISOString(),
    topics: ["kernel", "linux"],
    homepage: null
  },
  {
    id: 104,
    name: "twrp_device_xiaomi_sunstone",
    description: "TWRP Recovery tree for Xiaomi Redmi Note 12 5G",
    html_url: "https://github.com/himelpvz/twrp_device_xiaomi_sunstone",
    stargazers_count: 28,
    forks_count: 6,
    language: "Makefile",
    updated_at: new Date().toISOString(),
    topics: ["twrp", "recovery", "android"],
    homepage: null
  }
];

export const fetchProfile = async (): Promise<GitHubUser> => {
  // 1. Try Static Data (Pre-fetched during build)
  const staticData = await getStaticData();
  if (staticData?.profile) return staticData.profile;

  // 2. Try API with local caching
  try {
    const data = await getCachedData<GitHubUser>('profile', async () => {
      const response = await fetch(`https://api.github.com/users/${USERNAME}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    });
    return data || fallbackProfile;
  } catch (error) {
    return fallbackProfile;
  }
};

export const fetchRepos = async (): Promise<GitHubRepo[]> => {
  // 1. Try Static Data
  const staticData = await getStaticData();
  if (staticData?.repos) return staticData.repos;

  // 2. Try API with local caching
  try {
    const data = await getCachedData<GitHubRepo[]>('repos', async () => {
      const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`);
      if (!response.ok) throw new Error('Failed to fetch repos');
      return await response.json();
    });
    return data || FALLBACK_REPOS;
  } catch (error) {
    return FALLBACK_REPOS;
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
  // 1. Try Static Data
  const staticData = await getStaticData();
  if (staticData?.releases) return staticData.releases;

  // 2. Try API with local caching
  try {
    const data = await getCachedData<Release[]>('releases', async () => {
      const reposResponse = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=8`);
      
      if (!reposResponse.ok) {
        throw new Error("Could not fetch repo list for releases check");
      }
      
      const repos: GitHubRepo[] = await reposResponse.json();
      
      const releasePromises = repos.map(async (repo) => {
        try {
          const releaseResp = await fetch(`https://api.github.com/repos/${USERNAME}/${repo.name}/releases/latest`);
          if (releaseResp.ok) {
            const data = await releaseResp.json();
            return { ...data, repo_name: repo.name } as Release;
          }
        } catch (e) {
          // Ignore 404s
        }
        return null;
      });

      const results = await Promise.all(releasePromises);
      
      return results.filter((r): r is Release => r !== null)
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    });
    
    return data || [];

  } catch (error) {
    console.warn("Error fetching releases (likely rate limit), returning empty list.", error);
    return [];
  }
};
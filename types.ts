export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  homepage: string | null;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
  name: string;
}

export interface DeviceInfo {
  name: string;
  codename: string;
  chipset: string;
  status: 'Stable' | 'Beta' | 'Deprecated';
  image: string;
}

export enum Section {
  HOME = 'home',
  DEVICES = 'devices',
  PROJECTS = 'projects',
  SKILLS = 'skills',
  CONTACT = 'contact'
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  tags: string[];
  author: string;
  likes: number;
  dislikes: number;
}

export type BlogReaction = 'like' | 'dislike' | null;

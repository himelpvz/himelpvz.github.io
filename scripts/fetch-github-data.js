import fs from 'fs';
import path from 'path';

const USERNAME = 'himelpvz';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

async function fetchData() {
  console.log(`🚀 Starting GitHub Data Fetch for ${USERNAME}...`);

  try {
    // 1. Fetch Profile
    console.log('Fetching Profile...');
    const profileRes = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
    const profile = await profileRes.json();

    // 2. Fetch Repos
    console.log('Fetching Repositories...');
    const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`, { headers });
    const repos = await reposRes.json();

    // 3. Fetch Releases (Complex Logic)
    console.log('Fetching Releases...');
    // Fetch a list of repositories to check for releases (top 15 most recently updated)
    const repoListRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=15`, { headers });
    const repoList = await repoListRes.json();
    
    const releasePromises = Array.isArray(repoList) ? repoList.map(async (repo) => {
      try {
        const releaseResp = await fetch(`https://api.github.com/repos/${USERNAME}/${repo.name}/releases/latest`, { headers });
        if (releaseResp.ok) {
          const data = await releaseResp.json();
          return { ...data, repo_name: repo.name };
        }
      } catch (e) {
        // Ignore errors
      }
      return null;
    }) : [];

    const releasesResults = await Promise.all(releasePromises);
    const releases = releasesResults
      .filter(r => r !== null)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    // 4. Save Data
    const data = {
      profile,
      repos: Array.isArray(repos) ? repos : [],
      releases,
      generatedAt: Date.now()
    };

    const publicDir = path.resolve('public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    const outputPath = path.join(publicDir, 'github-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Data successfully saved to ${outputPath}`);

  } catch (error) {
    console.error("❌ Error fetching GitHub data:", error);
    process.exit(1);
  }
}

fetchData();
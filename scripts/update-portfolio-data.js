// scripts/update-portfolio-data.js
const fs = require("fs");
const path = require("path");

const USERNAME = "himelpvz";
const PER_PAGE = 100;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "github-portfolio-action",
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

async function fetchUser() {
  return fetchJson(`https://api.github.com/users/${USERNAME}`);
}

async function fetchRepos() {
  let page = 1;
  let repos = [];

  while (true) {
    const url = `https://api.github.com/users/${USERNAME}/repos?per_page=${PER_PAGE}&page=${page}&type=owner&sort=updated&direction=desc`;
    const batch = await fetchJson(url);
    repos = repos.concat(batch);
    if (batch.length < PER_PAGE) break;
    page += 1;
  }

  repos.sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );
  return repos;
}

async function fetchReleases(repos) {
  let releases = [];

  for (const repo of repos) {
    const url = `https://api.github.com/repos/${USERNAME}/${repo.name}/releases?per_page=5`;
    try {
      const list = await fetchJson(url);
      const filtered = list
        .filter((r) => !r.draft)
        .map((r) => ({
          ...r,
          repo_name: repo.name,
        }));
      releases = releases.concat(filtered);
    } catch (err) {
      // 404 == repo has no releases, ignore
      if (!String(err).includes("HTTP 404")) {
        console.warn("Failed releases for", repo.name, err.message);
      }
    }
  }

  releases.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at) -
      new Date(a.published_at || a.created_at)
  );

  return releases;
}

async function main() {
  console.log("Fetching GitHub data for", USERNAME);

  const user = await fetchUser();
  const repos = await fetchRepos();
  const releases = await fetchReleases(repos);

  const outDir = path.join(process.cwd(), "data");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "profile.json"),
    JSON.stringify(user, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "repos.json"),
    JSON.stringify(repos, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "releases.json"),
    JSON.stringify(releases, null, 2)
  );

  console.log(
    `Wrote profile, ${repos.length} repos and ${releases.length} releases to data/`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

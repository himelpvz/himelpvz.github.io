// =======================
// PORTFOLIO LOGIC (functions.js)
// =======================

// Your GitHub username
const USERNAME = "himelpvz";

// OPTIONAL: personal access token if you hit rate limits.
// If you don't want to expose a token, leave this null.
const GITHUB_TOKEN = null; // "ghp_your_token_here";

// ====== DOM ELEMENTS ======
const avatarEl = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const locationEl = document.getElementById("location");
const blogEl = document.getElementById("blog");
const githubLinkEl = document.getElementById("github-link");
const followersCountEl = document.getElementById("followers-count");
const followingCountEl = document.getElementById("following-count");
const repoCountEl = document.getElementById("repo-count");

const statusEl = document.getElementById("status");
const repoGrid = document.getElementById("repo-grid");
const refreshBtn = document.getElementById("refresh-btn");

const tabs = document.querySelectorAll(".tab");
const reposSection = document.getElementById("repos-section");
const releasesSection = document.getElementById("releases-section");
const releaseGrid = document.getElementById("release-grid");

let allRepos = [];
let allReleases = [];
let releasesLoaded = false;

// ====== UTILITIES ======

function setStatus(message, type = "info") {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = "status status--" + type;
}

function formatDate(isoString) {
  if (!isoString) return "Unknown";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(num) {
  if (num == null) return "0";
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return String(num);
}

function getHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "himelpvz-portfolio",
  };
  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

// ====== RENDERING ======

function renderProfile(user) {
  if (avatarEl) {
    avatarEl.src = user.avatar_url;
    avatarEl.alt = `${user.name || user.login}'s avatar`;
  }

  if (nameEl) nameEl.textContent = user.name || user.login;
  if (usernameEl) usernameEl.textContent = `@${user.login}`;
  if (bioEl) bioEl.textContent = user.bio || "";

  if (user.location && locationEl) {
    locationEl.style.display = "inline-flex";
    locationEl.textContent = `📍 ${user.location}`;
  } else if (locationEl) {
    locationEl.style.display = "none";
  }

  if (user.blog && blogEl) {
    let url = user.blog;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    blogEl.style.display = "inline-flex";
    blogEl.href = url;
  } else if (blogEl) {
    blogEl.style.display = "none";
  }

  if (githubLinkEl) githubLinkEl.href = user.html_url;

  if (followersCountEl)
    followersCountEl.textContent = formatNumber(user.followers);
  if (followingCountEl)
    followingCountEl.textContent = formatNumber(user.following);
  if (repoCountEl)
    repoCountEl.textContent = formatNumber(user.public_repos);
}

function renderRepos() {
  if (!repoGrid) return;
  repoGrid.innerHTML = "";

  if (!allRepos.length) {
    const empty = document.createElement("div");
    empty.className = "status status--info";
    empty.textContent = "No public repositories found.";
    repoGrid.appendChild(empty);
    return;
  }

  allRepos.forEach((repo) => {
    const card = document.createElement("article");
    card.className = "repo-card";

    const updated = formatDate(repo.updated_at);

    card.innerHTML = `
      <div class="repo-header">
        <div class="repo-title">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            ${repo.name}
          </a>
        </div>
        ${
          repo.fork
            ? `<span class="repo-badge" title="This repo is a fork">Fork</span>`
            : ""
        }
      </div>

      ${
        repo.description
          ? `<p class="repo-desc">${repo.description}</p>`
          : `<p class="repo-desc" style="opacity:0.7;font-style:italic;">No description provided.</p>`
      }

      <div class="repo-meta">
        <span class="repo-meta-item">
          ⭐ <strong>${formatNumber(repo.stargazers_count)}</strong> stars
        </span>
        <span class="repo-meta-item">
          ⑂ <strong>${formatNumber(repo.forks_count)}</strong> forks
        </span>
        ${
          repo.language
            ? `<span class="repo-meta-item">
                 🧬 <strong>${repo.language}</strong>
               </span>`
            : ""
        }
        <span class="repo-meta-item">
          ⏱ Updated <strong>${updated}</strong>
        </span>
      </div>
    `;

    repoGrid.appendChild(card);
  });
}

function renderReleases() {
  if (!releaseGrid) return;
  releaseGrid.innerHTML = "";

  if (!allReleases.length) {
    const empty = document.createElement("div");
    empty.className = "status status--info";
    empty.textContent = "No releases found yet.";
    releaseGrid.appendChild(empty);
    return;
  }

  allReleases.forEach((release) => {
    const card = document.createElement("article");
    card.className = "repo-card";

    const published = formatDate(release.published_at || release.created_at);

    card.innerHTML = `
      <div class="repo-header">
        <div class="repo-title">
          <a href="${release.html_url}" target="_blank" rel="noopener noreferrer">
            ${release.name || release.tag_name}
          </a>
        </div>
        <span class="repo-badge">
          ${release.repo_name}
        </span>
      </div>

      <p class="repo-desc">
        ${
          release.body
            ? release.body.split("\n")[0].slice(0, 140) + "..."
            : "Release notes not provided."
        }
      </p>

      <div class="repo-meta">
        <span class="repo-meta-item">
          🔖 <strong>${release.tag_name}</strong>
        </span>
        <span class="repo-meta-item">
          ⏱ Published <strong>${published}</strong>
        </span>
        ${
          release.prerelease
            ? `<span class="repo-meta-item"><strong>Pre-release</strong></span>`
            : ""
        }
      </div>
    `;

    releaseGrid.appendChild(card);
  });
}

// ====== API CALLS ======

async function fetchUser() {
  const res = await fetch(`https://api.github.com/users/${USERNAME}`, {
    headers: getHeaders(),
  });

  if (res.status === 404) throw new Error("User not found on GitHub.");
  if (res.status === 403)
    throw new Error(
      "GitHub API rate limit exceeded or access forbidden. Try again later."
    );
  if (!res.ok)
    throw new Error(`GitHub API error (${res.status}) while loading profile.`);

  return res.json();
}

async function fetchRepos() {
  const perPage = 100;
  let page = 1;
  let all = [];

  while (true) {
    const url = `https://api.github.com/users/${USERNAME}/repos?per_page=${perPage}&page=${page}&type=owner&sort=updated&direction=desc`;
    const res = await fetch(url, { headers: getHeaders() });

    if (res.status === 404)
      throw new Error("User not found while loading repositories.");
    if (res.status === 403)
      throw new Error(
        "GitHub API rate limit exceeded or access forbidden while loading repositories."
      );
    if (!res.ok)
      throw new Error(
        `GitHub API error (${res.status}) while loading repositories.`
      );

    const batch = await res.json();
    all = all.concat(batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  all.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  return all;
}

async function fetchReleasesForRepo(repoName) {
  const url = `https://api.github.com/repos/${USERNAME}/${repoName}/releases?per_page=5`;
  const res = await fetch(url, { headers: getHeaders() });

  if (res.status === 404) return []; // no releases
  if (res.status === 403)
    throw new Error("GitHub API rate limit exceeded while loading releases.");
  if (!res.ok)
    throw new Error(
      `GitHub API error (${res.status}) while loading releases for ${repoName}.`
    );

  const list = await res.json();
  return list
    .filter((r) => !r.draft)
    .map((r) => ({
      ...r,
      repo_name: repoName,
    }));
}

async function fetchAllReleases() {
  if (!allRepos.length) {
    allRepos = await fetchRepos();
  }

  const promises = allRepos.map((repo) =>
    fetchReleasesForRepo(repo.name).catch(() => [])
  );

  const results = await Promise.all(promises);
  const merged = results.flat();

  merged.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at) -
      new Date(a.published_at || a.created_at)
  );

  return merged;
}

// ====== LOADERS ======

async function loadPortfolio() {
  setStatus("Loading profile and repositories from GitHub…", "info");
  if (refreshBtn) refreshBtn.disabled = true;
  releasesLoaded = false;
  allReleases = [];

  if (repoGrid) {
    repoGrid.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const placeholder = document.createElement("article");
      placeholder.className = "repo-card";
      placeholder.innerHTML = `
        <div class="repo-header">
          <div class="repo-title" style="opacity:0.3;background:rgba(148,163,184,0.12);border-radius:999px;height:1.1rem;width:45%;"></div>
          <div style="opacity:0.2;background:rgba(148,163,184,0.1);border-radius:999px;height:0.9rem;width:18%;"></div>
        </div>
        <p class="repo-desc" style="opacity:0.25;">
          Loading…
        </p>
      `;
      repoGrid.appendChild(placeholder);
    }
  }

  try {
    const [user, repos] = await Promise.all([fetchUser(), fetchRepos()]);
    allRepos = repos;
    renderProfile(user);
    renderRepos();
    setStatus(
      `Loaded profile and ${repos.length} public repositories for @${USERNAME}.`,
      "success"
    );
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Failed to load data from GitHub.", "error");
    if (repoGrid) repoGrid.innerHTML = "";
  } finally {
    if (refreshBtn) refreshBtn.disabled = false;
  }
}

async function loadReleasesIfNeeded() {
  if (releasesLoaded) {
    renderReleases();
    return;
  }

  setStatus("Loading releases for all repositories…", "info");

  if (releaseGrid) {
    releaseGrid.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const placeholder = document.createElement("article");
      placeholder.className = "repo-card";
      placeholder.innerHTML = `
        <div class="repo-header">
          <div class="repo-title" style="opacity:0.3;background:rgba(148,163,184,0.1);border-radius:999px;height:1.1rem;width:60%;"></div>
        </div>
        <p class="repo-desc" style="opacity:0.25;">
          Loading releases…
        </p>
      `;
      releaseGrid.appendChild(placeholder);
    }
  }

  try {
    const releases = await fetchAllReleases();
    allReleases = releases;
    releasesLoaded = true;
    renderReleases();
    setStatus(
      releases.length
        ? `Loaded ${releases.length} releases across your repositories.`
        : "No releases found on your repositories yet.",
      "success"
    );
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Failed to load releases from GitHub.", "error");
    if (releaseGrid) releaseGrid.innerHTML = "";
  }
}

// ====== TABS & EVENTS ======

function activateTab(tabName) {
  tabs.forEach((btn) => {
    if (btn.dataset.tab === tabName) btn.classList.add("tab--active");
    else btn.classList.remove("tab--active");
  });

  if (tabName === "repos") {
    if (reposSection) reposSection.hidden = false;
    if (releasesSection) releasesSection.hidden = true;
    setStatus(
      `Showing ${allRepos.length || 0} repositories for @${USERNAME}.`,
      "info"
    );
  } else if (tabName === "releases") {
    if (reposSection) reposSection.hidden = true;
    if (releasesSection) releasesSection.hidden = false;
    loadReleasesIfNeeded();
  }
}

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.tab;
    activateTab(name);
  });
});

if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    loadPortfolio().then(() => {
      activateTab("repos");
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadPortfolio().then(() => {
    activateTab("repos");
  });
});

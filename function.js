// =======================
// PORTFOLIO LOGIC (functions.js)
// =======================

const USERNAME = "himelpvz";

// DOM elements
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

// Utilities
function setStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.className = "status status--" + type;
}

function formatDate(iso) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(n) {
  if (n == null) return "0";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

// Render Profile
function renderProfile(user) {
  avatarEl.src = user.avatar_url;
  nameEl.textContent = user.name || user.login;
  usernameEl.textContent = "@" + user.login;
  bioEl.textContent = user.bio || "";
  githubLinkEl.href = user.html_url;

  if (user.location) {
    locationEl.textContent = "📍 " + user.location;
    locationEl.style.display = "inline-flex";
  } else locationEl.style.display = "none";

  if (user.blog) {
    let url = user.blog.startsWith("http") ? user.blog : "https://" + user.blog;
    blogEl.href = url;
    blogEl.style.display = "inline-flex";
  } else blogEl.style.display = "none";

  followersCountEl.textContent = formatNumber(user.followers);
  followingCountEl.textContent = formatNumber(user.following);
  repoCountEl.textContent = formatNumber(user.public_repos);
}

// Render Repos
function renderRepos() {
  repoGrid.innerHTML = "";

  allRepos.forEach((repo) => {
    const card = document.createElement("article");
    card.className = "repo-card";

    card.innerHTML = `
      <div class="repo-header">
        <div class="repo-title">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </div>
        ${repo.fork ? `<span class="repo-badge">Fork</span>` : ""}
      </div>

      <p class="repo-desc">
        ${repo.description || "<i>No description provided.</i>"}
      </p>

      <div class="repo-meta">
        <span class="repo-meta-item">⭐ <strong>${formatNumber(repo.stargazers_count)}</strong></span>
        <span class="repo-meta-item">⑂ <strong>${formatNumber(repo.forks_count)}</strong></span>
        ${repo.language ? `<span class="repo-meta-item">${repo.language}</span>` : ""}
        <span class="repo-meta-item">⏱ ${formatDate(repo.updated_at)}</span>
      </div>
    `;

    repoGrid.appendChild(card);
  });
}

// Render Releases
function renderReleases() {
  releaseGrid.innerHTML = "";

  allReleases.forEach((rel) => {
    const card = document.createElement("article");
    card.className = "repo-card";

    card.innerHTML = `
      <div class="repo-header">
        <div class="repo-title">
          <a href="${rel.html_url}" target="_blank">${rel.name || rel.tag_name}</a>
        </div>
        <span class="repo-badge">${rel.repo_name}</span>
      </div>

      <p class="repo-desc">${rel.body ? rel.body.slice(0, 120) + "..." : "No notes."}</p>

      <div class="repo-meta">
        <span class="repo-meta-item">🔖 ${rel.tag_name}</span>
        <span class="repo-meta-item">⏱ ${formatDate(rel.published_at)}</span>
      </div>
    `;
    releaseGrid.appendChild(card);
  });
}

// Load local JSON data
async function loadPortfolio() {
  setStatus("Loading…", "info");

  try {
    const [user, repos] = await Promise.all([
      fetch("data/profile.json").then((r) => r.json()),
      fetch("data/repos.json").then((r) => r.json()),
    ]);

    allRepos = repos;
    renderProfile(user);
    renderRepos();
    setStatus("Loaded!", "success");
  } catch (err) {
    console.error(err);
    setStatus("Failed to load portfolio data.", "error");
  }
}

// Load releases only when needed
async function loadReleasesIfNeeded() {
  if (releasesLoaded) return renderReleases();

  try {
    const releases = await fetch("data/releases.json").then((r) => r.json());
    allReleases = releases;
    releasesLoaded = true;
    renderReleases();
    setStatus("Loaded releases!", "success");
  } catch (e) {
    console.error(e);
    setStatus("Failed to load releases.", "error");
  }
}

// Tabs
function activateTab(tab) {
  tabs.forEach((b) =>
    b.classList.toggle("tab--active", b.dataset.tab === tab)
  );

  if (tab === "repos") {
    reposSection.hidden = false;
    releasesSection.hidden = true;
  } else {
    reposSection.hidden = true;
    releasesSection.hidden = false;
    loadReleasesIfNeeded();
  }
}

// Events
tabs.forEach((b) =>
  b.addEventListener("click", () => activateTab(b.dataset.tab))
);

refreshBtn.addEventListener("click", () => {
  loadPortfolio().then(() => activateTab("repos"));
});

// Init page
window.addEventListener("DOMContentLoaded", () => {
  loadPortfolio();
  activateTab("repos");
});
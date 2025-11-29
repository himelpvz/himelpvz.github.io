const USERNAME = 'himelpvz';
const API_BASE = 'https://api.github.com';

// State
let appState = {
    repos: [],
    releases: [],
    releasesFetched: false
};

// --- DOM Helpers ---
const $ = (selector) => document.querySelector(selector);
const formatDate = (isoString) => new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

// --- Status Handling ---
function updateStatus(msg, type = 'normal') {
    const el = $('#status-bar');
    el.textContent = msg;
    el.className = `status-bar ${type}`;
}

// --- API Functions ---
async function fetchGitHubData(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            if (response.status === 403) throw new Error("API Rate Limit Exceeded");
            if (response.status === 404) throw new Error("User/Resource Not Found");
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function fetchProfileAndRepos() {
    updateStatus('Fetching profile and repositories...');
    try {
        // Parallel fetch for speed
        const [profile, repos] = await Promise.all([
            fetchGitHubData(`/users/${USERNAME}`),
            fetchGitHubData(`/users/${USERNAME}/repos?sort=updated&per_page=100`)
        ]);

        renderProfile(profile);
        appState.repos = repos;
        renderRepos(repos);
        updateStatus('Data loaded successfully', 'success');
    } catch (err) {
        $('#profile-section').innerHTML = `<div class="error">Failed to load profile.</div>`;
        updateStatus(err.message, 'error');
    }
}

async function fetchAllReleases() {
    if (appState.releasesFetched) return;
    
    updateStatus('Scanning repositories for releases... (This may take a moment)');
    const releaseGrid = $('#releases-grid');
    releaseGrid.innerHTML = '<div class="loader">Fetching releases info...</div>';

    try {
        // Filter only repos that are not forks (usually where releases are) or check all
        // To save API calls, we stick to non-forks primarily, or just first 10-15 active repos.
        // For this demo, we check all fetched repos but be mindful of rate limits.
        
        const releasePromises = appState.repos.map(repo => 
            fetchGitHubData(`/repos/${repo.full_name}/releases`)
                .then(releases => releases.map(r => ({ ...r, repo_name: repo.name, repo_url: repo.html_url })))
                .catch(() => []) // Ignore errors (e.g. no releases or 404) for individual repos
        );

        const results = await Promise.all(releasePromises);
        // Flatten and Sort by date (newest first)
        const flatReleases = results.flat().sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        appState.releases = flatReleases;
        appState.releasesFetched = true;
        renderReleases(flatReleases);
        updateStatus('Releases loaded', 'success');
    } catch (err) {
        updateStatus('Failed to load releases: ' + err.message, 'error');
    }
}

// --- Render Functions ---
function renderProfile(user) {
    const html = `
        <div class="avatar-wrapper">
            <img src="${user.avatar_url}" alt="${user.login}">
        </div>
        <h1 class="profile-name">${user.name || user.login}</h1>
        <a href="${user.html_url}" target="_blank" class="profile-username">@${user.login}</a>
        ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
        <div class="profile-stats">
            <span class="stat-item"><b>${user.public_repos}</b> Repos</span>
            <span class="stat-item"><b>${user.followers}</b> Followers</span>
        </div>
    `;
    $('#profile-section').innerHTML = html;
}

function renderRepos(repos) {
    const container = $('#repos-grid');
    if (repos.length === 0) {
        container.innerHTML = '<p>No public repositories found.</p>';
        return;
    }

    container.innerHTML = repos.map(repo => `
        <article class="card">
            <div class="card-header">
                <a href="${repo.html_url}" target="_blank" class="card-title">${repo.name}</a>
                ${repo.fork ? '<span class="badge fork">Fork</span>' : ''}
            </div>
            <p class="card-desc">${repo.description || 'No description provided.'}</p>
            <div class="card-meta">
                ${repo.language ? `<span class="badge lang">${repo.language}</span>` : ''}
                <span class="meta-item">★ ${repo.stargazers_count}</span>
                <span class="meta-item">🍴 ${repo.forks_count}</span>
                <span class="meta-item" style="margin-left:auto">Updated ${formatDate(repo.updated_at)}</span>
            </div>
        </article>
    `).join('');
}

function renderReleases(releases) {
    const container = $('#releases-grid');
    if (releases.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No releases found across repositories.</p>';
        return;
    }

    container.innerHTML = releases.map(rel => `
        <article class="card">
            <div class="card-header">
                <div>
                    <a href="${rel.html_url}" target="_blank" class="card-title">${rel.name || rel.tag_name}</a>
                    ${rel.prerelease ? '<span class="prerelease">Pre-release</span>' : ''}
                </div>
                <a href="${rel.repo_url}" target="_blank" class="badge">${rel.repo_name}</a>
            </div>
            <div class="release-tag">🏷️ ${rel.tag_name}</div>
            <p class="card-desc">
                ${rel.body ? (rel.body.substring(0, 100) + (rel.body.length > 100 ? '...' : '')) : 'No release notes.'}
            </p>
            <div class="card-meta">
                <span class="meta-item">📅 ${formatDate(rel.published_at)}</span>
            </div>
        </article>
    `).join('');
}

// functions.js - fetching GitHub, rendering, tabs, caching
// All user-specific values are configured here:
const GH_USER = 'himelpvz';
const REPOS_URL = `https://api.github.com/users/${GH_USER}/repos?type=owner&sort=updated&direction=desc`;

(() => {
  // state
  let repos = [];
  let profile = null;
  let releasesCache = null; // in-memory for session
  const refs = {};

  function $id(id) { return document.getElementById(id); }

  function isoToPretty(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  function shortFirstLine(text, max = 120) {
    if (!text) return '';
    const first = text.split('\n')[0].trim();
    if (first.length <= max) return first;
    return first.slice(0, max - 1).trim() + '…';
  }

  // status helpers
  function setStatus(msg, opts = {}) {
    window.HPZ_UI && window.HPZ_UI.setStatus(msg, opts);
  }

  // fetchers
  async function fetchJSON(url) {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' }});
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.status = res.status;
      err.response = res;
      throw err;
    }
    return res.json();
  }

  async function loadProfileAndRepos() {
    setStatus('Loading profile and repositories from GitHub…');
    // show skeletons
    renderRepoSkeletons();

    try {
      const [p, r] = await Promise.all([
        fetchJSON(`https://api.github.com/users/${GH_USER}`),
        fetchJSON(REPOS_URL)
      ]);
      profile = p;
      repos = Array.isArray(r) ? r : [];
      renderProfile();
      renderRepos();
      setStatus(`Loaded ${repos.length} repositories for @${GH_USER}.`);
    } catch (err) {
      console.error(err);
      if (err.status === 403) {
        setStatus('GitHub rate limit reached (HTTP 403). Please wait and try again later.', { level: 'error' });
        clearGrids();
      } else {
        setStatus('Failed to load data. Check your network and try refreshing.', { level: 'error' });
        clearGrids();
      }
    }
  }

  function clearGrids() {
    $id('reposGrid').innerHTML = '';
    $id('releasesGrid').innerHTML = '';
  }

  // rendering profile
  function renderProfile() {
    if (!profile) return;
    $id('avatarImg').src = profile.avatar_url + '&s=256';
    $id('avatarImg').alt = profile.name ? `${profile.name}'s avatar` : `${GH_USER} avatar`;
    $id('name').textContent = profile.name || GH_USER;
    $id('username').textContent = `@${profile.login}`;
    if (profile.bio) {
      const bioEl = $id('bio');
      bioEl.hidden = false;
      bioEl.textContent = profile.bio;
    } else {
      $id('bio').hidden = true;
    }

    // meta row
    const metaRow = $id('metaRow');
    metaRow.innerHTML = '';
    if (profile.location) {
      const loc = document.createElement('span');
      loc.className = 'meta-chip';
      loc.textContent = `📍 ${profile.location}`;
      metaRow.appendChild(loc);
    }
    if (profile.blog) {
      const link = document.createElement('a');
      link.className = 'meta-chip';
      const href = profile.blog.startsWith('http') ? profile.blog : 'https://' + profile.blog;
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = profile.blog.replace(/^https?:\/\//, '');
      metaRow.appendChild(link);
    }

    // stats
    const stats = $id('statsRow');
    stats.innerHTML = '';
    const items = [
      { k: 'followers', label: 'Followers' },
      { k: 'following', label: 'Following' },
      { k: 'public_repos', label: 'Public Repos' },
    ];
    items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'stat';
      div.innerHTML = `<div class="num">${profile[it.k] ?? 0}</div><div class="label">${it.label}</div>`;
      stats.appendChild(div);
    });

    // view on github link
    const view = $id('viewOnGithub');
    view.href = profile.html_url;
  }

  // repos rendering
  function renderRepoSkeletons(count = 6) {
    const grid = $id('reposGrid');
    grid.innerHTML = '';
    for (let i=0;i<count;i++){
      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:44px;height:44px;border-radius:8px;background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04));"></div>
          <div style="flex:1">
            <div class="skeleton" style="width:60%"></div>
            <div style="height:8px"></div>
            <div class="skeleton" style="width:90%"></div>
          </div>
        </div>`;
      grid.appendChild(c);
    }
  }

  function renderRepos() {
    const grid = $id('reposGrid');
    grid.innerHTML = '';

    if (!repos || repos.length === 0) {
      grid.innerHTML = `<div class="card"><p class="muted italic">No repositories found.</p></div>`;
      return;
    }

    repos.forEach(repo => {
      const card = document.createElement('article');
      card.className = 'card repo-card';
      // repo name
      const repoLink = document.createElement('a');
      repoLink.className = 'repo-name';
      repoLink.href = repo.html_url;
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';
      repoLink.textContent = repo.name;

      // optional fork badge
      if (repo.fork) {
        const forkBadge = document.createElement('span');
        forkBadge.className = 'pill';
        forkBadge.textContent = 'Fork';
        repoLink.appendChild(forkBadge);
      }

      // description
      const desc = document.createElement('p');
      desc.className = 'repo-desc';
      if (repo.description) {
        desc.textContent = repo.description;
      } else {
        desc.innerHTML = `<span class="italic">No description provided.</span>`;
      }

      // meta row
      const meta = document.createElement('div');
      meta.className = 'badge-row';
      const stars = document.createElement('span');
      stars.className = 'pill';
      stars.textContent = `⭐ ${repo.stargazers_count} stars`;
      meta.appendChild(stars);

      const forks = document.createElement('span');
      forks.className = 'pill';
      forks.textContent = `⑂ ${repo.forks_count} forks`;
      meta.appendChild(forks);

      if (repo.language) {
        const lang = document.createElement('span');
        lang.className = 'pill';
        lang.textContent = `🧬 ${repo.language}`;
        meta.appendChild(lang);
      }

      const updated = document.createElement('span');
      updated.className = 'pill';
      updated.textContent = `Updated ${isoToPretty(repo.updated_at)}`;
      meta.appendChild(updated);

      card.appendChild(repoLink);
      card.appendChild(desc);
      card.appendChild(meta);

      grid.appendChild(card);
    });
  }

  // Releases
  async function loadAndRenderReleases() {
    const grid = $id('releasesGrid');
    grid.innerHTML = '';
    setStatus('Loading releases for repositories…');

    // if cached, use it
    if (releasesCache) {
      renderReleases(releasesCache);
      setStatus(`Loaded ${releasesCache.length} releases from cache.`);
      return;
    }

    try {
      // fetch releases per repo (only first 5 per repo)
      // to avoid spamming, do a limited concurrency
      const perRepo = repos.map(r => ({ name: r.name, full_name: r.full_name }));
      const all = [];
      const concurrency = 6;
      for (let i = 0; i < perRepo.length; i += concurrency) {
        const slice = perRepo.slice(i, i + concurrency);
        const promises = slice.map(r => fetchJSONSafe(`https://api.github.com/repos/${GH_USER}/${encodeURIComponent(r.name)}/releases?per_page=5`));
        const results = await Promise.all(promises);
        results.forEach((res, idx) => {
          if (Array.isArray(res)) {
            res.forEach(rel => {
              if (!rel.draft) {
                all.push(Object.assign({}, rel, { repo_name: slice[idx].name }));
              }
            });
          }
        });
      }

      // sort by published_at desc
      all.sort((a,b) => new Date(b.published_at) - new Date(a.published_at));
      releasesCache = all;
      renderReleases(all);
      setStatus(`Loaded ${all.length} releases for @${GH_USER}.`);
    } catch (err) {
      console.error(err);
      if (err.status === 403) {
        setStatus('GitHub rate limit reached while loading releases (HTTP 403).', { level: 'error' });
        grid.innerHTML = '';
      } else {
        setStatus('Failed to load releases. Check network and try again.', { level: 'error' });
        grid.innerHTML = '';
      }
    }
  }

  // safe fetcher - returns [] on 404 or empty
  async function fetchJSONSafe(url) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' }});
      if (!res.ok) {
        if (res.status === 404) return [];
        const err = new Error('HTTP ' + res.status);
        err.status = res.status;
        throw err;
      }
      return res.json();
    } catch (err) {
      throw err;
    }
  }

  function renderReleases(list) {
    const grid = $id('releasesGrid');
    grid.innerHTML = '';

    if (!list || list.length === 0) {
      grid.innerHTML = '<div class="card"><p class="muted italic">No releases found.</p></div>';
      return;
    }

    list.forEach(rel => {
      const card = document.createElement('article');
      card.className = 'card release-card';

      // header row: title + repo badge
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.gap = '0.5rem';

      const title = document.createElement('div');
      title.style.fontWeight = '700';
      title.textContent = rel.name || rel.tag_name;
      header.appendChild(title);

      const repoBadge = document.createElement('div');
      repoBadge.className = 'repo-badge';
      repoBadge.textContent = rel.repo_name;
      header.appendChild(repoBadge);

      // short summary
      const summary = document.createElement('p');
      summary.className = 'repo-desc';
      summary.textContent = shortFirstLine(rel.body || '', 140) || 'No summary provided.';

      // meta row
      const meta = document.createElement('div');
      meta.className = 'badge-row';
      const tag = document.createElement('span');
      tag.className = 'pill';
      tag.textContent = `🏷 ${rel.tag_name}`;
      meta.appendChild(tag);

      const pub = document.createElement('span');
      pub.className = 'pill';
      pub.textContent = `Published ${isoToPretty(rel.published_at)}`;
      meta.appendChild(pub);

      if (rel.prerelease) {
        const pre = document.createElement('span');
        pre.className = 'pill';
        pre.textContent = 'Pre-release';
        meta.appendChild(pre);
      }

      // action - link to release
      const link = document.createElement('a');
      link.className = 'pill';
      link.href = rel.html_url;
      link.textContent = 'View release';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      meta.appendChild(link);

      card.appendChild(header);
      card.appendChild(summary);
      card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  // tabs handling
  function activateTab(tabName) {
    const reposSection = $id('reposSection');
    const releasesSection = $id('releasesSection');
    const tabRepos = $id('tabRepos');
    const tabReleases = $id('tabReleases');

    if (tabName === 'repos') {
      tabRepos.classList.add('active');
      tabRepos.setAttribute('aria-selected', 'true');
      tabReleases.classList.remove('active');
      tabReleases.setAttribute('aria-selected', 'false');
      reposSection.classList.remove('hidden');
      releasesSection.classList.add('hidden');
      setStatus(`Showing repositories for @${GH_USER}.`);
    } else if (tabName === 'releases') {
      tabRepos.classList.remove('active');
      tabRepos.setAttribute('aria-selected', 'false');
      tabReleases.classList.add('active');
      tabReleases.setAttribute('aria-selected', 'true');
      reposSection.classList.add('hidden');
      releasesSection.classList.remove('hidden');
      // only load releases on first time
      if (!releasesCache) {
        loadAndRenderReleases();
      } else {
        renderReleases(releasesCache);
        setStatus(`Showing ${releasesCache.length} cached releases.`);
      }
    }
  }

  // attach UI events
  function attachEvents() {
    $id('tabRepos').addEventListener('click', () => activateTab('repos'));
    $id('tabReleases').addEventListener('click', () => activateTab('releases'));

    $id('refreshBtn').addEventListener('click', async () => {
      releasesCache = null;
      setStatus('Refreshing profile and repositories…');
      await loadProfileAndRepos();
    });

    // keyboard accessibility: left/right to toggle tabs
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach(t => {
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const idx = Array.from(tabs).indexOf(t);
          const next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          tabs[next].focus();
          tabs[next].click();
        }
      });
    });
  }

  // bootstrap
  document.addEventListener('DOMContentLoaded', () => {
    attachEvents();
    // start fetching
    loadProfileAndRepos();
    // default tab = repos
    activateTab('repos');
  });

})();

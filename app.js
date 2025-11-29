document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initApp();
    setupEventListeners();
});

function initApp() {
    // Reset state on full reload/refresh
    appState = { repos: [], releases: [], releasesFetched: false };
    fetchProfileAndRepos();
}

function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Refresh Button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        // Clear caches visually
        $('#repos-grid').innerHTML = '<div class="loader">Refreshing...</div>';
        $('#releases-grid').innerHTML = '';
        initApp();
    });

    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.dataset.tab;
            
            // UI Toggle
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            document.querySelectorAll('.content-grid').forEach(grid => grid.classList.add('hidden'));
            document.getElementById(`${target}-grid`).classList.remove('hidden');

            // Logic trigger
            if (target === 'releases') {
                fetchAllReleases(); // Handles caching internally
            }
        });
    });
}

// --- Theme Logic ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

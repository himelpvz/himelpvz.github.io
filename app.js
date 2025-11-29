// app.js - theme handling and shared UI helpers
(() => {
  const THEME_KEY = 'hpz_theme';
  const HTML = document.documentElement;
  const themeToggle = () => document.getElementById('themeToggle');

  function applyTheme(theme) {
    HTML.setAttribute('data-theme', theme);
    const btn = themeToggle();
    if (!btn) return;
    if (theme === 'dark') {
      btn.textContent = '🌙';
      btn.title = 'Switch to light mode';
      btn.setAttribute('aria-pressed', 'false');
    } else {
      btn.textContent = '☀️';
      btn.title = 'Switch to dark mode';
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const defaultTheme = saved || 'dark';
    applyTheme(defaultTheme);

    const btn = themeToggle();
    btn.addEventListener('click', () => {
      const current = HTML.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
      // small aria-live update for assistive tech
      const status = document.getElementById('statusBar');
      if (status) status.textContent = `Switched to ${next} theme.`;
    });
  }

  // Expose a tiny helper for status updates from functions.js
  window.HPZ_UI = {
    setStatus(message, { level = 'info' } = {}) {
      const status = document.getElementById('statusBar');
      if (!status) return;
      status.textContent = message;
      status.style.color = (level === 'error') ? getComputedStyle(document.documentElement).getPropertyValue('--danger') : '';
      if (level === 'error') {
        status.classList.add('error');
      } else {
        status.classList.remove('error');
      }
    }
  };

  document.addEventListener('DOMContentLoaded', initTheme);
})();

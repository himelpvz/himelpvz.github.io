// =======================
// THEME SYSTEM (app.js)
// =======================

const themeToggleBtn = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

function applyTheme(theme) {
  const safeTheme = theme === "light" ? "light" : "dark";
  rootEl.setAttribute("data-theme", safeTheme);
  localStorage.setItem("theme", safeTheme);

  if (themeToggleBtn) {
    if (safeTheme === "light") {
      themeToggleBtn.textContent = "☀️";
      themeToggleBtn.title = "Switch to dark mode";
    } else {
      themeToggleBtn.textContent = "🌙";
      themeToggleBtn.title = "Switch to light mode";
    }
  }
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initial = saved || (prefersDark ? "dark" : "dark");
  applyTheme(initial);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = rootEl.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
});
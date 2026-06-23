// Shared theme + sidebar bootstrap for all top-level pages.
// Theme is applied as early as possible via the inline snippet in <head>;
// this file loads the shared sidebar, marks the active link, and wires the toggle.

(function () {
  const STORAGE_KEY = 'theme';

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function currentTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleLabel(theme);
  }

  function updateToggleLabel(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const dark = theme === 'dark';
    btn.querySelector('.tt-icon').textContent = dark ? '☀️' : '🌙';
    btn.querySelector('.tt-label').textContent = dark ? 'Light mode' : 'Dark mode';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Follow the system theme only while the user hasn't made an explicit choice.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(currentTheme());
    });
  }

  function markActiveNav() {
    const here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar [data-nav]').forEach((el) => {
      const target = el.getAttribute('data-nav');
      if (target === here) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  function loadSidebar() {
    const mount = document.getElementById('sidebar-container');
    if (!mount) {
      // No sidebar on this page; still ensure theme is applied.
      applyTheme(currentTheme());
      return;
    }
    // sidebarBase lets pages in subfolders point back to the root sidebar/links.
    const base = mount.getAttribute('data-base') || '';
    fetch(base + 'sidebar.html')
      .then((r) => r.text())
      .then((html) => {
        // Rewrite root-relative hrefs/src in the fetched sidebar to honour the base.
        if (base) html = html.replace(/(href|src)="(?!https?:|#|\/\/)/g, `$1="${base}`);
        mount.innerHTML = html;
        applyTheme(currentTheme());
        markActiveNav();
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.addEventListener('click', toggleTheme);
      })
      .catch(() => applyTheme(currentTheme()));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
  } else {
    loadSidebar();
  }
})();

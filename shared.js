const bg = document.getElementById('bg');
let af = 0;

/** Solid page background via `body { background: var(--bg) }`; #bg stays clear. */
function setStaticBackdrop() {
  if (!bg) return;
  cancelAnimationFrame(af);
  af = 0;
  bg.style.backgroundImage = 'none';
  bg.style.backgroundColor = 'transparent';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = document.getElementById('theme-label');
  if (label) label.textContent = theme === 'dark' ? 'Dark' : 'Light';
  document.querySelectorAll('.toggle').forEach((el) => {
    if (el.closest?.('.modal')) return;
    el.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  });
  setStaticBackdrop();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
}

const saved = localStorage.getItem('theme') || 'dark';
applyTheme(saved);

function wireThemeToggle() {
  document.querySelectorAll('.toggle').forEach((el) => {
    if (el.__themeWired) return;
    el.__themeWired = true;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  });
}

function markActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('active');
      if (current !== 'index.html') {
        link.textContent = 'Μετάνοια';
        link.setAttribute('href', 'index.html');
      }
    }
  });
}

markActiveNav();

async function requireAuth() {
  // Mark pages requiring auth with <body data-require-auth="true">
  const should = document.body && document.body.dataset && document.body.dataset.requireAuth === 'true';
  if (!should) return;
  try {
    const sb = getSupabase();
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    if (!data || !data.session) window.location.href = 'auth.html';
  } catch (e) {
    console.warn('[auth] session check failed', e);
    window.location.href = 'auth.html';
  }
}

wireThemeToggle();
requireAuth();

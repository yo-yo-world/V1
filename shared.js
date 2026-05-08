const bg = document.getElementById('bg');
let t = 0, af;

function dark() {
  t += .0002;
  bg.style.backgroundImage = 'radial-gradient(ellipse at '+(20+Math.sin(t)*15)+'% '+(50+Math.cos(t*.7)*20)+'%,#1c1410 0%,transparent 55%),radial-gradient(ellipse at '+(80+Math.cos(t*.8)*12)+'% '+(20+Math.sin(t*.9)*18)+'%,#0e1410 0%,transparent 55%),radial-gradient(ellipse at '+(60+Math.sin(t*1.1)*10)+'% '+(80+Math.cos(t*.6)*15)+'%,#14090f 0%,transparent 55%)';
  af = requestAnimationFrame(dark);
}

function light() {
  t += .0002;
  bg.style.backgroundImage = 'radial-gradient(ellipse at '+(20+Math.sin(t)*15)+'% '+(50+Math.cos(t*.7)*20)+'%,#ede8e0 0%,transparent 55%),radial-gradient(ellipse at '+(80+Math.cos(t*.8)*12)+'% '+(20+Math.sin(t*.9)*18)+'%,#e8ede0 0%,transparent 55%),radial-gradient(ellipse at '+(60+Math.sin(t*1.1)*10)+'% '+(80+Math.cos(t*.6)*15)+'%,#ede0e8 0%,transparent 55%)';
  af = requestAnimationFrame(light);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = document.getElementById('theme-label');
  if (label) label.textContent = theme === 'dark' ? 'Dark' : 'Light';

  const pressed = theme !== 'dark';
  document.querySelectorAll('.toggle[aria-pressed]').forEach((el) => {
    el.setAttribute('aria-pressed', String(pressed));
  });
  cancelAnimationFrame(af);
  theme === 'dark' ? dark() : light();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
}

const saved = localStorage.getItem('theme') || 'dark';
applyTheme(saved);

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

function isAuthPage() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  return current === 'auth.html';
}

async function requireAuth() {
  if (isAuthPage()) return;
  if (typeof getSupabase !== 'function') return;

  try {
    const sb = getSupabase();
    const { data } = await sb.auth.getSession();
    if (!data?.session) window.location.href = 'auth.html';
  } catch {
    // If auth can't be checked (SDK not loaded), fail open for now.
  }
}

function wireThemeToggle() {
  document.querySelectorAll('.toggle').forEach((el) => {
    el.addEventListener('click', () => toggleTheme());
  });
}

wireThemeToggle();
requireAuth();

function updateHeaderOffsetVar() {
  // Only needed for anima background layers (manifesto/canvas).
  const isAnima = document.body && document.body.classList.contains('anima-page');
  if (!isAnima) return;

  const header = document.querySelector('header');
  if (!header) return;

  const rect = header.getBoundingClientRect();
  const offset = Math.max(0, Math.ceil(rect.bottom));
  document.documentElement.style.setProperty('--header-offset', `${offset}px`);
}

// Ensure background layers never overlap the header/nav.
updateHeaderOffsetVar();
window.addEventListener('resize', updateHeaderOffsetVar);
window.addEventListener('load', updateHeaderOffsetVar);

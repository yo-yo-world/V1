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
  if (label) {
    const t = window.MetanoiaI18n && window.MetanoiaI18n.t;
    label.textContent = t
      ? t(theme === 'dark' ? 'theme.dark' : 'theme.light')
      : theme === 'dark'
        ? 'Dark'
        : 'Light';
  }
  document.querySelectorAll('.toggle').forEach((el) => {
    if (el.closest?.('.modal')) return;
    if (el.classList.contains('toggle-bg-particles')) return;
    el.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  });
  setStaticBackdrop();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;

const BG_PARTICLES_KEY = 'bgParticlesInteractive';

function getBgParticlesInteractive() {
  const v = localStorage.getItem(BG_PARTICLES_KEY);
  return v !== '0' && v !== 'false';
}

function setBgParticlesInteractive(on) {
  localStorage.setItem(BG_PARTICLES_KEY, on ? '1' : '0');
  if (typeof window.__metanoiaSyncBgParticlesInteractive === 'function') {
    window.__metanoiaSyncBgParticlesInteractive(on);
  }
  document.dispatchEvent(new CustomEvent('metanoia:bgparticles', { detail: { on: !!on } }));
}

function applyBgParticlesToggleState() {
  const btn = document.getElementById('bg-particles-toggle');
  const label = document.getElementById('bg-particles-label');
  if (!btn) return;
  const on = getBgParticlesInteractive();
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  if (label) {
    const t = window.MetanoiaI18n && window.MetanoiaI18n.t;
    label.textContent = t
      ? t(on ? 'settings.bgParticles.on' : 'settings.bgParticles.off')
      : on
        ? 'On'
        : 'Off';
  }
}

function wireBgParticlesToggle() {
  const el = document.getElementById('bg-particles-toggle');
  if (!el || el.__bgParticlesWired) return;
  el.__bgParticlesWired = true;
  applyBgParticlesToggleState();
  el.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBgParticlesInteractive(!getBgParticlesInteractive());
    applyBgParticlesToggleState();
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setBgParticlesInteractive(!getBgParticlesInteractive());
      applyBgParticlesToggleState();
    }
  });
}

function wireThemeToggle() {
  document.querySelectorAll('.toggle').forEach((el) => {
    if (el.classList.contains('toggle-bg-particles')) return;
    if (el.__themeWired) return;
    el.__themeWired = true;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
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
  const t = window.MetanoiaI18n && window.MetanoiaI18n.t;
  const homeLabel = t ? t('nav.home') : 'Μετάνοια';
  const homeHref = 'index.html';

  document.querySelectorAll('nav a').forEach((link) => {
    const sectionKey = link.getAttribute('data-i18n');
    const sectionHref =
      link.getAttribute('data-nav-href') ||
      link.dataset.navSectionHref ||
      link.getAttribute('href');

    if (!link.dataset.navSectionKey && sectionKey && sectionKey !== 'nav.home') {
      link.dataset.navSectionKey = sectionKey;
    }
    const canonicalHref = link.getAttribute('data-nav-href') || link.dataset.navSectionHref;
    if (canonicalHref && canonicalHref !== 'index.html') {
      link.dataset.navSectionHref = canonicalHref;
    } else if (sectionHref && sectionHref !== 'index.html' && !link.dataset.navSectionHref) {
      link.dataset.navSectionHref = sectionHref;
    }

    const isCurrent = (link.dataset.navSectionHref || sectionHref) === current;
    if (isCurrent && current === 'index.html') {
      link.classList.add('active');
      return;
    }

    if (isCurrent) {
      link.classList.remove('active');
      link.textContent = homeLabel;
      link.setAttribute('href', homeHref);
      link.setAttribute('data-i18n', 'nav.home');
      link.dataset.navShowsHome = 'true';
      return;
    }

    if (link.dataset.navShowsHome === 'true') {
      link.dataset.navShowsHome = '';
      const restoreKey = link.dataset.navSectionKey;
      const restoreHref = link.dataset.navSectionHref;
      if (restoreKey) link.setAttribute('data-i18n', restoreKey);
      if (restoreHref) link.setAttribute('href', restoreHref);
      if (restoreKey && t) link.textContent = t(restoreKey);
    }
  });
}

window.markActiveNav = markActiveNav;

function wireLogoNavReveal() {
  const header = document.querySelector('header');
  const brand = document.querySelector('.header-brand');
  const logo = brand ? brand.querySelector('.logo-placeholder') : document.querySelector('.logo-placeholder');
  const nav = document.querySelector('header nav');
  if (!header || !logo || !nav) return;

  const hoverZone = brand || logo;

  const HIDE_IDLE_MS = 1500;
  let hideTimer = 0;

  function clearTimers() {
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = 0;
  }

  function hideNav() {
    header.classList.remove('nav-revealed');
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = 0;
  }

  function scheduleHide() {
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hideNav, HIDE_IDLE_MS);
  }

  function revealNow() {
    header.classList.add('nav-revealed');
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = 0;
  }

  hoverZone.addEventListener('mouseenter', revealNow, { passive: true });

  // Touch/mobile + click: first interaction reveals menu; second click can navigate home (if logo is <a>)
  logo.addEventListener('click', (e) => {
    const isRevealed = header.classList.contains('nav-revealed');
    if (!isRevealed) {
      e.preventDefault();
      revealNow();
      scheduleHide();
      return;
    }
    scheduleHide();
  });

  hoverZone.addEventListener(
    'mouseleave',
    () => {
      // Держим меню на экране ещё 3 секунды после ухода с лого
      if (header.classList.contains('nav-revealed')) scheduleHide();
    },
    { passive: true },
  );

  // Позволяем навести на nav после раскрытия (и продлеваем жизнь меню)
  nav.addEventListener('mouseenter', revealNow, { passive: true });
  nav.addEventListener(
    'mouseleave',
    () => header.classList.contains('nav-revealed') && scheduleHide(),
    { passive: true },
  );
  nav.addEventListener('focusin', revealNow);
  nav.addEventListener('focusout', () => header.classList.contains('nav-revealed') && scheduleHide());

  // Любое действие в header/nav продлевает жизнь меню ещё на 3 секунды (idle-таймер)
  ['mousemove', 'pointermove', 'click', 'keydown'].forEach((evt) => {
    header.addEventListener(
      evt,
      () => header.classList.contains('nav-revealed') && scheduleHide(),
      { passive: evt !== 'keydown' },
    );
  });

  // При уходе со страницы — убрать
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      clearTimers();
      hideNav();
    }
  });
}

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

function bootSiteChrome() {
  if (window.MetanoiaI18n && typeof window.MetanoiaI18n.ensureSiteSettings === 'function') {
    window.MetanoiaI18n.ensureSiteSettings();
  }
  if (window.MetanoiaI18n && typeof window.MetanoiaI18n.apply === 'function') {
    window.MetanoiaI18n.apply();
  }
  applyTheme(document.documentElement.dataset.theme || savedTheme);
  wireThemeToggle();
  wireBgParticlesToggle();
}

bootSiteChrome();
wireLogoNavReveal();
requireAuth();

document.addEventListener('metanoia:langchange', () => {
  applyTheme(document.documentElement.dataset.theme || 'dark');
  markActiveNav();
  if (window.MetanoiaI18n && typeof window.MetanoiaI18n.updateSiteSettings === 'function') {
    window.MetanoiaI18n.updateSiteSettings();
  }
  applyBgParticlesToggleState();
});

window.applyBgParticlesToggleState = applyBgParticlesToggleState;
window.getBgParticlesInteractive = getBgParticlesInteractive;
window.setBgParticlesInteractive = setBgParticlesInteractive;

document.addEventListener('metanoia:bgparticles', applyBgParticlesToggleState);

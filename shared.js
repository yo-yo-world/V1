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
  document.getElementById('theme-label').textContent = theme === 'dark' ? 'Dark' : 'Light';
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
    if (href === current) link.classList.add('active');
  });
}

markActiveNav();

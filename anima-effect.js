(() => {
  const canvas = document.getElementById('anima-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const POSTS = [
    {
      id: 'manifesto',
      title: 'MANIFESTO',
      bodyHtml: `<p>From interpretation of reality to participation in it. What appears as a cycle is a limitation of perception. Dawn and dusk, Birth and death, The yo-yo in the hand before the throw And the yo-yo returned to the hand, These are not repetitions. They are projections of divided thinking attempting to stabilize itself. Metanoia removes the division. Not by unifying concepts, but by eliminating the need for division altogether. It is enough to see that action is inseparable from the one who perceives it. Reality is neither constructed nor observed. It is encountered in interaction. And interaction is never abstract, it is always concrete, embodied, precise.</p>`,
    },
    {
      id: 'chapter-1-bratislava',
      title: 'CHAPTER I — BRATISLAVA',
      bodyHtml: `<p>I woke up, today is 29.04.2026. Nearby. A great sunny day, a hangover. All night I tried to get rid of the feeling of helicopters — that sensation of the room spinning while I couldn't keep up. In the end I was sick in the morning, remnants of undigested wine. I went for breakfast and took everything fatty — beans, mushrooms, two eggs, Turkish spiral sausage, coffee and a chocolate bun. As we discussed pressing matters over breakfast, I started feeling better.</p>`,
    },
  ];

  // Multi-language word bank (short tokens)
  const WORDS = [
    'metanoia', 'interface', 'signal', 'silence', 'structure', 'precision', 'return', 'discipline', 'perception', 'energy',
    'manifesto', 'bratislava', 'genesis', 'string', 'clarity', 'encounter',
    'μετάνοια', 'λόγος', 'ἀλήθεια', 'ῥυθμός', 'σῶμα',
    'метаноя', 'тишина', 'точность', 'структура', 'возврат', 'ясность',
    '無', '間', '道', '気', '心', '空',
    'معنى', 'صمت', 'نور', 'شكل',
  ];

  function randInt(n) {
    return Math.floor(Math.random() * n);
  }

  function buildStreamChars(targetLen = 24000) {
    const out = [];
    while (out.length < targetLen) {
      const w = WORDS[randInt(WORDS.length)];
      for (const ch of w.toUpperCase()) out.push(ch);
      out.push(' ');
      if (Math.random() < 0.15) out.push(' ');
      if (Math.random() < 0.06) out.push('\n');
    }
    // normalize: keep only chars + spaces (newlines become spaces for grid continuity)
    return out.map((c) => (c === '\n' ? ' ' : c));
  }

  // Lightweight value noise (no dependencies)
  function hash2(x, y) {
    let h = x * 374761393 + y * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function noise2(x, y) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const xf = x - x0;
    const yf = y - y0;

    const a = hash2(x0, y0);
    const b = hash2(x0 + 1, y0);
    const c = hash2(x0, y0 + 1);
    const d = hash2(x0 + 1, y0 + 1);

    const u = smoothstep(xf);
    const v = smoothstep(yf);
    const ab = a + (b - a) * u;
    const cd = c + (d - c) * u;
    return ab + (cd - ab) * v;
  }

  function fbm2(x, y) {
    let v = 0;
    let a = 0.5;
    let f = 1.0;
    for (let i = 0; i < 4; i++) {
      v += a * noise2(x * f, y * f);
      f *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  function getThemeInk() {
    const cs = getComputedStyle(document.documentElement);
    const hex = cs.getPropertyValue('--text').trim() || '#ffffff';
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return [240, 236, 230];
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  }

  const state = {
    dpr: 1,
    w: 0,
    h: 0,
    chars: buildStreamChars(),
    t0: performance.now(),
    last: performance.now(),
    hoverId: null,
    hit: [], // [{id,x,y,w,h}]
    scrollPx: 0,
    // link x positions that can change when they re-enter
    linkX: {
      manifesto: 0,
      bratislava: 0,
      lastWrap1: -1,
      lastWrap2: -1,
    },
  };

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.dpr = dpr;
    state.w = Math.max(1, window.innerWidth);
    state.h = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(state.w * dpr);
    canvas.height = Math.floor(state.h * dpr);
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function openPost(id) {
    const post = POSTS.find((p) => p.id === id);
    if (!post) return;
    const modal = document.getElementById('post-modal');
    const title = document.getElementById('post-title');
    const body = document.getElementById('post-body');
    if (!modal || !title || !body) return;
    title.textContent = post.title;
    body.innerHTML = post.bodyHtml;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePost() {
    const modal = document.getElementById('post-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest('[data-close-post]') || (t.id === 'post-modal' && t.classList.contains('modal'))) closePost();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePost();
  });

  function hitTest(x, y) {
    for (const r of state.hit) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r.id;
    }
    return null;
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const id = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    state.hoverId = id;
    canvas.style.cursor = id ? 'pointer' : 'default';
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const id = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (id) openPost(id);
  });

  function drawFrame(now) {
    const dt = Math.min(0.05, (now - state.last) / 1000);
    state.last = now;
    const t = (now - state.t0) / 1000;
    const ink = getThemeInk();

    ctx.clearRect(0, 0, state.w, state.h);

    // Match the OpenProcessing/p5 vibe:
    // grid ~ (x+=6, y+=12), fspeed ~ frameCount/20, flaming map(y,height,0,0.2,0.8)
    const stepX = 6;
    const stepY = 12;
    const m = Math.min(state.w, state.h);
    const bigT = m / 18;
    const littleT = m / 36;

    // Smooth continuous flow (top -> bottom)
    if (!prefersReduced) state.scrollPx += dt * 28;
    const scrollPx = prefersReduced ? 0 : state.scrollPx;

    // Keep it “background”: soft alpha
    const baseAlpha = 0.18;
    const linkAlpha = 0.75;
    const hoverAlpha = 0.95;

    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${baseAlpha})`;
    ctx.font = `700 11px "Courier New", monospace`;

    state.hit = [];

    // Link placement aligned to grid so it feels “inside”
    const link1 = POSTS[0];
    const link2 = POSTS[1];
    const linkRow1 = Math.floor((state.h * 0.36) / stepY);
    const linkRow2 = Math.floor((state.h * 0.62) / stepY);
    const baseCol1 = Math.floor((state.w * 0.12) / stepX);
    const baseCol2 = Math.floor((state.w * 0.18) / stepX);

    const link1Str = link1.title;
    const link2Str = link2.title;

    // Seamless wrap: draw rows at y = (y0 + scroll) % h (no jump)
    const wrapH = state.h + stepY;
    const scrollY = scrollPx % wrapH;

    // When a link cycles (goes past bottom and re-enters top), allow X to change.
    const wrapIndex1 = Math.floor((scrollPx + linkRow1 * stepY) / wrapH);
    const wrapIndex2 = Math.floor((scrollPx + linkRow2 * stepY) / wrapH);
    const maxCols = Math.max(1, Math.floor((state.w - 40) / stepX));
    if (state.linkX.lastWrap1 !== wrapIndex1) {
      state.linkX.lastWrap1 = wrapIndex1;
      const drift = Math.floor((fbm2(wrapIndex1 * 1.7, 12.3) - 0.5) * 18);
      state.linkX.manifesto = Math.max(6, Math.min(maxCols - link1Str.length - 6, baseCol1 + drift));
    }
    if (state.linkX.lastWrap2 !== wrapIndex2) {
      state.linkX.lastWrap2 = wrapIndex2;
      const drift = Math.floor((fbm2(wrapIndex2 * 1.9, 44.1) - 0.5) * 22);
      state.linkX.bratislava = Math.max(6, Math.min(maxCols - link2Str.length - 6, baseCol2 + drift));
    }

    const linkCol1 = state.linkX.manifesto;
    const linkCol2 = state.linkX.bratislava;

    // stable link hitboxes (computed once per frame)
    const link1X = linkCol1 * stepX;
    const link1Y = (linkRow1 * stepY + scrollY) % wrapH;
    const link2X = linkCol2 * stepX;
    const link2Y = (linkRow2 * stepY + scrollY) % wrapH;

    ctx.save();
    ctx.font = `800 16px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const link1W = ctx.measureText(link1Str).width;
    const link2W = ctx.measureText(link2Str).width;
    ctx.restore();

    // record hitboxes in screen coords (wrap if they cross bottom)
    const hitH = 22;
    const normY = (yy) => {
      let y = yy;
      while (y < -hitH) y += state.h + hitH;
      while (y > state.h) y -= state.h + hitH;
      return y;
    };
    state.hit.push({ id: link1.id, x: link1X - 2, y: normY(link1Y) - 2, w: link1W + 4, h: hitH });
    state.hit.push({ id: link2.id, x: link2X - 2, y: normY(link2Y) - 2, w: link2W + 4, h: hitH });

    // Approximate p5's fspeed = frameCount/20 using time (smooth).
    const fspeed = prefersReduced ? 0 : (t * 3.0); // tuned to feel like frameCount/20

    const map01 = (v, a, b) => (v - a) / (b - a);
    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    for (let y0 = 8; y0 < state.h + stepY; y0 += stepY) {
      const y = (y0 + scrollY) % wrapH;
      const yWrap = y > state.h ? y - wrapH : y; // keep within visible range smoothly
      const row = Math.floor(y0 / stepY);
      const rowIdx = row + Math.floor(scrollPx / stepY);
      // p5: flaming = map(y, height, 0, 0.2, 0.8)
      const flaming = 0.2 + (0.8 - 0.2) * (1.0 - clamp01(map01(yWrap, 0, state.h)));
      for (let x = 10; x < state.w - 10; x += stepX) {
        const col = Math.floor(x / stepX);

        // If we are at link row/col, inject link string chars
        let injected = null;
        let injectId = null;
        let injectIndex = -1;
        if (row === linkRow1 && col >= linkCol1 && col < linkCol1 + link1Str.length) {
          injected = link1Str[col - linkCol1];
          injectId = link1.id;
          injectIndex = col - linkCol1;
        } else if (row === linkRow2 && col >= linkCol2 && col < linkCol2 + link2Str.length) {
          injected = link2Str[col - linkCol2];
          injectId = link2.id;
          injectIndex = col - linkCol2;
        }

        // p5-like noise sample:
        // na = noise(x/50, y/100+fspeed, fspeed)
        // We approximate 3D noise with 2D noise by mixing time into both axes.
        const na = fbm2(x / 50 + fspeed * 0.35, (yWrap / 100) + fspeed);
        const size = na < flaming ? na * littleT : na * bigT;

        // advance by row to make the whole texture "fall" together
        const base = (rowIdx * 4096 + col) % state.chars.length;
        const ch = injected ?? state.chars[base];
        if (ch === ' ') continue;

        const isLinkChar = Boolean(injectId);
        const isHover = isLinkChar && state.hoverId === injectId;

        if (isLinkChar) {
          ctx.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${isHover ? hoverAlpha : linkAlpha})`;
          ctx.font = `800 ${isHover ? 18 : 16}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
          const drawX = x;
          const drawY = yWrap;
          ctx.fillText(ch, drawX, drawY);
        } else {
          ctx.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${baseAlpha})`;
          ctx.font = `700 ${Math.max(8, Math.min(26, size))}px "Courier New", monospace`;
          ctx.fillText(ch, x, yWrap);
        }
      }
    }

    requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(drawFrame);
})();


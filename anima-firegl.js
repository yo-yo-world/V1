// Multi-language word bank (short tokens)
const WORDS = [
  'metanoia', 'interface', 'signal', 'silence', 'structure', 'precision', 'return', 'discipline', 'perception', 'energy',
  'manifesto', 'bratislava', 'genesis', 'string', 'clarity', 'encounter', 'rotation', 'recognition',
  'μετάνοια', 'λόγος', 'ἀλήθεια', 'ῥυθμός', 'σῶμα', 'κόσμος', 'ἀνάγκη',
  'метаноя', 'тишина', 'точность', 'структура', 'возврат', 'ясность', 'встреча',
  '無', '間', '道', '気', '心', '空', '光', '影',
  'معنى', 'صمت', 'نور', 'شكل', 'حقيقة',
];

const POSTS = [
  {
    id: 'manifesto',
    title: 'MANIFESTO',
    bodyHtml: `<p>From interpretation of reality to participation in it. What appears as a cycle is a limitation of perception. Dawn and dusk, Birth and death, The yo-yo in the hand before the throw And the yo-yo returned to the hand, These are not repetitions. They are projections of divided thinking attempting to stabilize itself. Metanoia removes the division. Not by unifying concepts, but by eliminating the need for division altogether. It is enough to see that action is inseparable from the one who perceives it. Reality is neither constructed nor observed. It is encountered in interaction. And interaction is never abstract, it is always concrete, embodied, precise. An object is not a fixed entity. It is a condition within a relationship. Being is not a stable identity. It is a position within that same relationship. Only that which exists in interaction exists at all. The yo-yo is not cyclical. It becomes cyclical in the hands of one who repeats without awareness. In the hands of a master it is not a cycle, it is a controlled release and return of energy. Rotation is not essence. Rotation is suspension, A temporary state in which movement conceals structure. The moment of stillness is not the end of a trick. It is the moment in which structure becomes visible. Not because movement disappears, but because the illusion does. Mastery is not control over movement. It is clarity of interaction. The string is not a tool. It is an interface, The medium through which intention becomes material. It does not connect two separate objects. It defines the relationship in which both sides become distinguishable. To play beyond play. To be beyond being. There is only the moment in which rules cease to be mistaken for reality. To leave the game does not mean to abandon it, It means to stop confusing its structure with truth. Being does not arise from emptiness. It arises from precision. Silence is not absence. It is the state in which distortion is no longer sustained. The sound of one hand is not a paradox. It is a reminder that meaning does not require symmetry. Return is not repetition. Return is recognition. Divided thinking does not hold, Not because it is forbidden, But because it cannot maintain clarity. Metanoia is not belief. It is a discipline of perception. And perception, when disciplined, Does not withdraw from reality, It enters it.</p>`,
  },
  {
    id: 'chapter-1-bratislava',
    title: 'CHAPTER I — BRATISLAVA',
    bodyHtml: `<p>I woke up, today is 29.04.2026. Nearby. A great sunny day, a hangover. All night I tried to get rid of the feeling of helicopters — that sensation of the room spinning while I couldn't keep up. In the end I was sick in the morning, remnants of undigested wine. I went for breakfast and took everything fatty — beans, mushrooms, two eggs, Turkish spiral sausage, coffee and a chocolate bun. As we discussed pressing matters over breakfast, I started feeling better.</p>
<p>During lunch I was scrolling IG and came across a post that the European Yo-Yo Championship would be held in Bratislava that weekend, May 2–3. We had planned to fly home to Vilnius on the 1st, but this message planted the idea of changing our route. As a result we changed our tickets and were already in Bratislava on the 1st.</p>
<p>(…full text continues…)</p>`,
  },
];

function randInt(n) {
  return Math.floor(Math.random() * n);
}

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

function buildStreamChars(targetLen = 24000) {
  const out = [];
  while (out.length < targetLen) {
    const w = WORDS[randInt(WORDS.length)];
    for (const ch of w.toUpperCase()) out.push(ch);
    out.push(' ');
    if (Math.random() < 0.15) out.push(' ');
  }
  return out;
}

function hexToRgb01(hex) {
  const h = String(hex || '').trim();
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  if (!m) return [1, 1, 1];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

function getThemeTextRgb01() {
  const cs = getComputedStyle(document.documentElement);
  const t = cs.getPropertyValue('--text').trim();
  return hexToRgb01(t);
}

function getThemeAccentRgb01() {
  // Green hyperlinks (theme-aware).
  // Dark: brighter green; Light: deeper green.
  const theme = document.documentElement.dataset.theme;
  return theme === 'light' ? [0.02, 0.35, 0.16] : [0.22, 1.0, 0.56];
}

/** Palette — mass B/W; links pleasant green (darker on light, softer mint on dark). */
function getAnimaPaletteRgb01() {
  const theme = document.documentElement.dataset.theme;
  if (theme === 'light') {
    return { textRgb: [0.2, 0.2, 0.2], accentRgb: hexToRgb01('#15b068') };
  }
  return { textRgb: [0.78, 0.78, 0.78], accentRgb: hexToRgb01('#6efbcf') };
}

function compileShader(gl, type, source) {
  const s = gl.createShader(type);
  if (!s) throw new Error('shader create failed');
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const msg = gl.getShaderInfoLog(s) || 'shader compile failed';
    gl.deleteShader(s);
    throw new Error(msg);
  }
  return s;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const p = gl.createProgram();
  if (!p) throw new Error('program create failed');
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const msg = gl.getProgramInfoLog(p) || 'program link failed';
    gl.deleteProgram(p);
    throw new Error(msg);
  }
  return p;
}

function ensureLen(arr, len) {
  while (arr.length < len) arr.push(' ');
  return arr;
}

function findSpaceRunInRow(chars, cols, row, needed, preferredCol) {
  const rowStart = row * cols;
  const rowEnd = rowStart + cols;
  const maxStart = rowEnd - needed;

  const isFreeAt = (start) => {
    if (start < rowStart || start > maxStart) return false;
    // require one space margin on both sides so we don't cut words
    if (start - 1 >= rowStart && chars[start - 1] !== ' ') return false;
    if (start + needed < rowEnd && chars[start + needed] !== ' ') return false;
    for (let i = 0; i < needed; i++) {
      if (chars[start + i] !== ' ') return false;
    }
    return true;
  };

  const pref = rowStart + Math.max(1, Math.min(cols - needed - 1, preferredCol));
  for (let r = 0; r < cols; r++) {
    const s1 = pref - r;
    if (isFreeAt(s1)) return s1;
    const s2 = pref + r;
    if (isFreeAt(s2)) return s2;
  }

  // Fallback: allow overwriting but still pad around to reduce "word cutting".
  return Math.max(rowStart + 1, Math.min(maxStart - 1, pref));
}

function createTextTextureCanvas(size, textRgb, accentRgb, chars, links) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2d ctx unavailable');

  ctx.clearRect(0, 0, size, size);
  ctx.globalCompositeOperation = 'source-over';
  // IMPORTANT:
  // - shader uses tex.a as glyph mask
  // - shader uses tex.r as "link mask" (0 normal, 1 link)
  // so we draw normal glyphs with red=0, links with red=255
  // Bigger typewriter texture (still light on GPU)
  ctx.font = '700 22px "Courier New", monospace';
  ctx.textBaseline = 'top';

  const stepX = 12;
  const stepY = 20;
  // Fill the whole texture so it can tile seamlessly.
  const cols = Math.max(1, Math.floor(size / stepX));
  const rows = Math.max(1, Math.floor(size / stepY));
  const cellCount = cols * rows;

  ensureLen(chars, cellCount);

  // Inject link titles into the flow (no overlay).
  // Also build a per-cell link mask.
  const linkMask = new Uint8Array(cellCount);
  const linkId = new Uint8Array(cellCount);

  ctx.save();
  const linkFontBase = 16;
  ctx.font = `800 ${linkFontBase}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  ctx.textBaseline = 'top';
  for (const link of links) {
    const startCol = Math.max(0, Math.min(cols - 1, Math.floor(link.x / stepX)));
    const startRow = Math.max(0, Math.min(rows - 1, Math.floor(link.y / stepY)));
    const titleChars = Array.from(link.title.toUpperCase());
    const start = findSpaceRunInRow(chars, cols, startRow, titleChars.length, startCol);

    // Ensure padding spaces around the title so it doesn't merge with neighbors.
    const rowStart = startRow * cols;
    const rowEnd = rowStart + cols;
    if (start - 1 >= rowStart) chars[start - 1] = ' ';
    if (start + titleChars.length < rowEnd) chars[start + titleChars.length] = ' ';

    for (let i = 0; i < titleChars.length; i++) {
      const idx = start + i;
      if (idx >= 0 && idx < cellCount) {
        chars[idx] = titleChars[i];
        linkMask[idx] = 255;
        linkId[idx] = link.id === 'manifesto' ? 80 : 160; // encode link id in green channel
      }
    }
    // Hitbox (still measured with proportional font, but positioned on grid)
    const w = ctx.measureText(link.title).width;
    const hPx = 20;
    const colPlaced = start - startRow * cols;
    link.px = { x: colPlaced * stepX, y: startRow * stepY, w, h: hPx };
    link.uv = {
      x: (colPlaced * stepX) / size,
      // WebGL texture coordinates origin is bottom-left; we flip on upload.
      // So store UV in the same orientation as the shader samples after flip.
      y: 1.0 - ((startRow * stepY + hPx) / size),
      w: w / size,
      h: hPx / size,
    };
  }
  ctx.restore();

  // Draw the grid.
  // IMPORTANT: Make the texture tile seamlessly WITHOUT copying edge bands.
  // We draw "wrap duplicates" for cells near the edges so sampling with REPEAT+fract()
  // never shows a seam or a doubled/overlaid band.
  const drawGlyph = (ch, x, y, fillStyle) => {
    ctx.fillStyle = fillStyle;
    ctx.fillText(ch, x, y);
    // Wrap duplicates for seamless tiling.
    if (x < stepX) ctx.fillText(ch, x + size, y);
    if (y < stepY) ctx.fillText(ch, x, y + size);
    if (x < stepX && y < stepY) ctx.fillText(ch, x + size, y + size);
  };

  let p = 0;
  for (let row = 0; row < rows; row++) {
    const y = row * stepY;
    for (let col = 0; col < cols; col++) {
      const x = col * stepX;
      const idx = row * cols + col;
      const ch = chars[idx] ?? chars[p % chars.length];
      if (ch !== ' ') {
        const isLink = linkMask[idx] > 0;
        // Encode link in red channel; alpha is the glyph mask
        const a = isLink ? 0.98 : 0.92;
        const fillStyle = isLink ? `rgba(255, ${linkId[idx]}, 0, ${a})` : `rgba(0, 0, 0, ${a})`;
        drawGlyph(ch, x, y, fillStyle);
      }
      p++;
    }
  }

  return c;
}

function mountFireGL() {
  const host = document.getElementById('anima-canvas-container');
  if (!host) return;

  host.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.className = 'anima-firegl-canvas';
  host.appendChild(canvas);

  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) {
    console.warn('[anima] WebGL not available.');
    return;
  }

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Modal wiring (reuse existing modal styles)
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

  const vs = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_pos + 1.0) * 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fs = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_tex;
    uniform float u_time;
    uniform float u_scroll;
    uniform vec3 u_text;
    uniform vec3 u_link;
    uniform float u_hover_any;
    uniform float u_hover_key;
    uniform float u_light;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = v_uv;
      float t = u_time;
      // upward drift: use accumulated scroll to avoid jumps
      uv.y += u_scroll;

      float n = fbm(uv * vec2(3.0, 6.0) + vec2(0.0, t * 0.55));
      float n2 = fbm(uv * vec2(9.0, 14.0) + vec2(t * 0.35, -t * 0.75));
      vec2 disp = vec2((n2 - 0.5) * 0.02, (n - 0.5) * 0.05);

      // Regular sample (distorted): keeps links inside the flow.
      vec4 tex = texture2D(u_tex, fract(uv + disp));
      float a = tex.a;
      float linkMask = smoothstep(0.45, 0.9, tex.r);
      float linkId = tex.g * 255.0;
      float hoverMatch = step(0.5, u_hover_key) * (1.0 - step(18.0, abs(linkId - u_hover_key)));
      float hoverOnThis = linkMask * hoverMatch;

      float glow = smoothstep(0.05, 0.9, a) * (0.40 + 0.60 * n);

      float L = step(0.5, u_light);
      float massShade = mix(glow, clamp(0.54 + 0.40 * glow, 0.50, 0.96), L);
      // Dark: amber. Light: RGB complement vec3(1)-amber (cyan family), analogous to invert B↔W.
      vec3 amber = vec3(1.0, 0.40, 0.12);
      vec3 massAccent = mix(amber, vec3(1.0) - amber, L);
      float fireW = mix(0.52 + 0.34 * n2, 0.54 + 0.32 * n2, L);
      vec3 baseTone = mix(u_text, massAccent, fireW);
      vec3 baseCol = baseTone * massShade;

      float linkShade = mix((0.96 + 0.12 * n2) * glow, 0.94 + 0.28 * n2, L);
      vec3 linkHue = min(mix(u_link, vec3(1.0) - u_link, L) * 1.12, vec3(1.0));
      vec3 col = mix(baseCol, linkHue * linkShade, linkMask);

      // Hover: "grow" ONLY the hovered link (visual contact)
      if (hoverOnThis > 0.01) {
        // Stronger dilation to feel like real size increase (still cheap).
        float dx = 0.0042;
        float dy = 0.0058;
        float a2 = texture2D(u_tex, fract(uv + disp + vec2( dx, 0.0))).a;
        float a3 = texture2D(u_tex, fract(uv + disp + vec2(-dx, 0.0))).a;
        float a4 = texture2D(u_tex, fract(uv + disp + vec2(0.0,  dy))).a;
        float a5 = texture2D(u_tex, fract(uv + disp + vec2(0.0, -dy))).a;
        float a6 = texture2D(u_tex, fract(uv + disp + vec2( dx,  dy))).a;
        float a7 = texture2D(u_tex, fract(uv + disp + vec2(-dx,  dy))).a;
        float a8 = texture2D(u_tex, fract(uv + disp + vec2( dx, -dy))).a;
        float a9 = texture2D(u_tex, fract(uv + disp + vec2(-dx, -dy))).a;
        // second ring
        float a10 = texture2D(u_tex, fract(uv + disp + vec2( dx * 1.7, 0.0))).a;
        float a11 = texture2D(u_tex, fract(uv + disp + vec2(-dx * 1.7, 0.0))).a;
        float a12 = texture2D(u_tex, fract(uv + disp + vec2(0.0,  dy * 1.6))).a;
        float a13 = texture2D(u_tex, fract(uv + disp + vec2(0.0, -dy * 1.6))).a;
        a = max(a, max(max(max(a2, a3), max(a4, a5)), max(max(a6, a7), max(a8, a9))));
        a = max(a, max(max(a10, a11), max(a12, a13)));
        glow *= 1.22;
        col *= 1.14;
      }

      float outA = a * mix(0.15 + 0.29 * glow, 0.24 + 0.50 * glow, L);
      outA = min(outA * mix(1.0, 1.0 + 0.42 * linkMask, L), 0.93);
      gl_FragColor = vec4(col, outA);
    }
  `;

  let program;
  try {
    program = createProgram(gl, vs, fs);
  } catch (e) {
    console.warn('[anima] WebGL shader error:', e);
    return;
  }

  const posLoc = gl.getAttribLocation(program, 'a_pos');
  const timeLoc = gl.getUniformLocation(program, 'u_time');
  const scrollLoc = gl.getUniformLocation(program, 'u_scroll');
  const textLoc = gl.getUniformLocation(program, 'u_text');
  const linkLoc = gl.getUniformLocation(program, 'u_link');
  const hoverAnyLoc = gl.getUniformLocation(program, 'u_hover_any');
  const hoverKeyLoc = gl.getUniformLocation(program, 'u_hover_key');
  const lightLoc = gl.getUniformLocation(program, 'u_light');
  const texLoc = gl.getUniformLocation(program, 'u_tex');

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

  let streamChars = buildStreamChars();
  // Pick stable-ish link positions on the texture grid.
  const links = [
    { id: POSTS[0].id, title: POSTS[0].title, x: 90, y: 260, uv: null, px: null },
    { id: POSTS[1].id, title: POSTS[1].title, x: 120, y: 520, uv: null, px: null },
  ];

  let hoverId = null;

  function uploadTextTexture() {
    const { textRgb, accentRgb } = getAnimaPaletteRgb01();
    const src = createTextTextureCanvas(1024, textRgb, accentRgb, streamChars, links);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    return { textRgb, accentRgb };
  }

  let colors = uploadTextTexture();
  const themeObserver = new MutationObserver(() => {
    colors = uploadTextTexture();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function resize() {
    // Safari/mobile browsers can report unstable vh/innerHeight due to toolbars.
    // Prefer visualViewport when available.
    const vv = window.visualViewport;
    const w = Math.max(1, Math.floor((vv && vv.width) ? vv.width : window.innerWidth));
    const h = Math.max(1, Math.floor((vv && vv.height) ? vv.height : window.innerHeight));
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resize);
    window.visualViewport.addEventListener('scroll', resize);
  }

  gl.enable(gl.BLEND);
  // Additive blending can create "double brightness" layering artifacts on wrap/hover.
  // Use standard alpha blending for a steadier, non-layering look.
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const start = performance.now();
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
  });

  // Accurate hit testing via tiny WebGL "pick" pass (accounts for displacement).
  let currentT = 0;
  let currentScroll = 0;
  const pickVs = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;
  const pickFs = `
    precision mediump float;
    uniform sampler2D u_tex;
    uniform float u_time;
    uniform float u_scroll;
    uniform vec2 u_mouse;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = u_mouse;
      float t = u_time;
      uv.y += u_scroll;
      float n = fbm(uv * vec2(3.0, 6.0) + vec2(0.0, t * 0.55));
      float n2 = fbm(uv * vec2(9.0, 14.0) + vec2(t * 0.35, -t * 0.75));
      vec2 disp = vec2((n2 - 0.5) * 0.02, (n - 0.5) * 0.05);
      
      // Multi-sample around cursor to be forgiving (handles distortion).
      float best = 0.0;
      float bestId = 0.0;
      float bestM80 = 0.0;
      float bestM160 = 0.0;
      vec2 base = fract(uv + disp);
      // Keep hit-test local: too large radius makes it "grab" links from far away.
      vec2 px = vec2(1.0 / 1024.0, 1.0 / 1024.0) * 12.0; // hit radius
      for (int yy = -2; yy <= 2; yy++) {
        for (int xx = -2; xx <= 2; xx++) {
          vec2 off = vec2(float(xx), float(yy)) * px;
          vec4 tex = texture2D(u_tex, fract(base + off));
          float m = smoothstep(0.45, 0.9, tex.r);
          float id = tex.g * 255.0;
          // Track per-link maxima to avoid "hover bleeding" between links.
          float is80 = 1.0 - step(18.0, abs(id - 80.0));
          float is160 = 1.0 - step(18.0, abs(id - 160.0));
          bestM80 = max(bestM80, m * is80);
          bestM160 = max(bestM160, m * is160);
        }
      }
      if (bestM160 > bestM80) { best = bestM160; bestId = 160.0 / 255.0; }
      else { best = bestM80; bestId = 80.0 / 255.0; }
      gl_FragColor = vec4(best, bestId, 0.0, 1.0);
    }
  `;

  let pickProgram;
  try {
    pickProgram = createProgram(gl, pickVs, pickFs);
  } catch (e) {
    console.warn('[anima] pick shader error:', e);
    pickProgram = null;
  }
  const pickPosLoc = pickProgram ? gl.getAttribLocation(pickProgram, 'a_pos') : -1;
  const pickTimeLoc = pickProgram ? gl.getUniformLocation(pickProgram, 'u_time') : null;
  const pickScrollLoc = pickProgram ? gl.getUniformLocation(pickProgram, 'u_scroll') : null;
  const pickMouseLoc = pickProgram ? gl.getUniformLocation(pickProgram, 'u_mouse') : null;
  const pickTexLoc = pickProgram ? gl.getUniformLocation(pickProgram, 'u_tex') : null;

  const pickFbo = gl.createFramebuffer();
  const pickTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, pickTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, pickFbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickTex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  function pickAt(clientX, clientY) {
    if (!pickProgram) return false;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return false;
    // WebGL UV origin is bottom-left, DOM is top-left.
    const yFlip = 1 - y;

    gl.bindFramebuffer(gl.FRAMEBUFFER, pickFbo);
    gl.viewport(0, 0, 1, 1);
    gl.disable(gl.BLEND);
    gl.useProgram(pickProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(pickPosLoc);
    gl.vertexAttribPointer(pickPosLoc, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(pickTexLoc, 0);
    gl.uniform1f(pickTimeLoc, currentT);
    if (pickScrollLoc) gl.uniform1f(pickScrollLoc, currentScroll);
    gl.uniform2f(pickMouseLoc, x, yFlip);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const px = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // restore viewport for next frame render
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    // Return link id if hit, else null. Also return strength for hysteresis.
    const strength = px[0] / 255;
    // Keep a small floor so we don't get "too sticky" on weak traces.
    if (px[0] <= 95) return { id: null, strength };
    // px[1] is link id encoding (80 manifesto, 160 bratislava)
    if (px[1] >= 130) return { id: 'chapter-1-bratislava', strength };
    return { id: 'manifesto', strength };
  }

  function pickAtBest(clientX, clientY) {
    // Small local multi-probe around cursor to cover distortion offsets in screen space.
    // Keep it tight to avoid grabbing links from far away.
    const rect = canvas.getBoundingClientRect();
    const step = Math.max(4, Math.min(9, Math.min(rect.width, rect.height) * 0.010)); // px
    const probes = [
      [0, 0],
      [step, 0],
      [-step, 0],
      [0, step],
      [0, -step],
    ];

    const center = pickAt(clientX, clientY);
    const centerId = center && typeof center === 'object' ? center.id : null;
    const centerStrength = center && typeof center === 'object' ? center.strength : 0;
    // If center is already a hit, keep it (prevents "too sticky" grabbing nearby).
    if (centerId) return center;

    // Otherwise, allow surrounding probes but require higher confidence.
    const surroundMinStrength = 0.80;
    let best = { id: null, strength: 0 };
    for (const [dx, dy] of probes) {
      const hit = pickAt(clientX + dx, clientY + dy);
      if (
        hit &&
        typeof hit === 'object' &&
        hit.id &&
        hit.strength >= surroundMinStrength &&
        hit.strength > best.strength
      ) best = hit;
    }
    return best;
  }

  // Hover picking: sync with animation frame to avoid jitter from stale u_time/u_scroll.
  let lastPickAt = 0;
  let stableHover = null;
  let lastStableHitAt = 0;
  let mouseX = 0;
  let mouseY = 0;
  let mouseInside = false;

  canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseInside = true;
  });
  canvas.addEventListener('mouseleave', () => {
    mouseInside = false;
    stableHover = null;
    hoverId = null;
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', (e) => {
    const hit = pickAtBest(e.clientX, e.clientY);
    const hitId = hit && typeof hit === 'object' ? hit.id : null;
    if (hitId) openPost(hitId);
  });

  let lastNow = start;
  let speed = 0.015;

  function frame() {
    if (!running || prefersReduced) {
      requestAnimationFrame(frame);
      return;
    }
    const now = performance.now();
    const t = (now - start) / 1000;
    currentT = t;
    const dt = Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;

    // Smooth speed changes to avoid "jumping" when hover toggles
    // Freeze vertical drift on hover; keep wobble (displacement) alive.
    const targetSpeed = hoverId ? 0.0 : 0.015;
    speed += (targetSpeed - speed) * 0.08;
    currentScroll += dt * speed;

    // NOTE: no periodic re-upload on wrap; keeps the stream perfectly continuous.

    // Do hover pick after updating time/scroll (30hz is plenty).
    if (mouseInside && now - lastPickAt > 16) {
      lastPickAt = now;
      const hit = pickAtBest(mouseX, mouseY);
      const hitId = hit && typeof hit === 'object' ? hit.id : null;
      const strength = hit && typeof hit === 'object' ? hit.strength : 0;

      // Hysteresis: avoid flicker when distortion makes pick hover borderline.
      const lockOn = 0.52;
      const releaseAt = 0.34;
      const stickyMs = 120; // keep hover through distortion "gaps"
      if (!stableHover) {
        if (hitId && strength >= lockOn) stableHover = hitId;
      } else {
        if (hitId === stableHover) {
          // keep
        } else if (!hitId && strength <= releaseAt) {
          // If we recently had a stable hit, keep it a bit longer (distortion gaps).
          if (now - lastStableHitAt > stickyMs) stableHover = null;
        } else if (hitId && strength >= lockOn) {
          stableHover = hitId;
        }
      }

      if (hitId && hitId === stableHover && strength >= releaseAt) lastStableHitAt = now;

      if (stableHover !== hoverId) hoverId = stableHover;
      canvas.style.cursor = hoverId ? 'pointer' : 'default';
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(texLoc, 0);
    gl.uniform1f(timeLoc, t);
    gl.uniform1f(scrollLoc, currentScroll);
    gl.uniform3f(textLoc, colors.textRgb[0], colors.textRgb[1], colors.textRgb[2]);
    gl.uniform3f(linkLoc, colors.accentRgb[0], colors.accentRgb[1], colors.accentRgb[2]);
    gl.uniform1f(hoverAnyLoc, hoverId ? 1.0 : 0.0);
    gl.uniform1f(hoverKeyLoc, hoverId === 'manifesto' ? 80.0 : (hoverId === 'chapter-1-bratislava' ? 160.0 : 0.0));
    gl.uniform1f(lightLoc, document.documentElement.dataset.theme === 'light' ? 1.0 : 0.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountFireGL);
} else {
  mountFireGL();
}


/**
 * Header particle logo (p5 instance mode — не конфликтует с глобальным скетчем на index).
 * Разметка: <div class="header-particle-mount" data-particle-logo></div> внутри .header-brand.
 */
(function mountParticleLogoHeader() {
  const hosts = document.querySelectorAll('[data-particle-logo]');
  if (!hosts.length || typeof p5 === 'undefined') return;

  const navSyncCallbacks = [];

  const IMAGE_FILES = [
    'images-2-3ce790ba-6bdb-495b-9746-04b7c3e51860.png',
    'F-Runic_letter_dagaz-8980d702-fe9a-4a29-a45f-06f8c05da6eb.png',
    'st_small_507x507-pad_600x600_f8f8f8-01d5e9c0-f7a3-4d13-ac5c-2e90af29df53.png',
    'christian-fish-3-0bee3461-be75-4e94-82d9-32fb141540e2.png',
    'images-3-af723c38-123a-44ad-8960-9bafa42a4128.png',
    'Ying_yang_sign.jpg-ccb5fd13-d033-4083-9f85-8cad6dbd8b8b.png',
    'depositphotos_381815336-stock-illustration-scales-icon-scales-justice-vector-ee83d389-bb96-4d82-93e2-5db961daf4c3.png',
    'black-stars-illustration-white-background-flag-europe-european-vector-illustration_790651-265.jpg-4bce2057-0645-4516-bd53-7d2089f6b0b3.png',
    '923555pw600-73046f43-481d-4220-a2ed-a4dd8c4fba36.png',
  ];

  const IMG_BASE = 'logo-particle/';
  const ATTR_MORPH = 0.022;
  const DAMP_MORPH = 0.91;
  const HOLD_FRAMES = 90;
  const TRANS_FRAMES = 55;
  /** Высота зоны частиц; ширина = ширина `.header-particle-mount`. */
  const CANVAS_H = 72;
  /** Запас по краям канваса (логическая ширина layout = canvasW), чтобы разлёт не обрезался. */
  const BLEED_PAD_X = 140;
  const BLEED_PAD_Y = 56;
  /** Радиус «коробки» морфа как у бывшего лого 56px. */
  const SHAPE_RADIUS = (56 * 248) / 560;
  const N = 1600;

  function hexToRgb(hex) {
    let h = (hex || '').trim();
    if (!h) return [222, 218, 212];
    if (h[0] === '#') h = h.slice(1);
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    const m = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [222, 218, 212];
  }

  function themeRgb() {
    return hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--text').trim());
  }

  function prepareImageForSampling(img) {
    const maxW = 400;
    if (img.width > maxW) img.resize(maxW, 0);
  }

  function sampleForeground(p, img, opts) {
    opts = opts || {};
    const cropYMax = opts.cropYMax != null ? opts.cropYMax : 1;
    const radiusScale = opts.radiusScale != null ? opts.radiusScale : 1;
    const targetRadius = opts.targetRadius != null ? opts.targetRadius : SHAPE_RADIUS;
    img.loadPixels();
    const w = img.width;
    const h = Math.max(1, Math.floor(img.height * cropYMax));
    const step = w * h > 700000 ? 2 : 1;
    const px = img.pixels;
    function brightAt(x, y) {
      const i = 4 * (x + y * w);
      return (px[i] + px[i + 1] + px[i + 2]) / 3;
    }
    let sum = 0;
    let n = 0;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        sum += brightAt(x, y);
        n++;
      }
    }
    const meanBright = n ? sum / n : 128;
    const fgDark = meanBright >= 128;
    const pts = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const b = brightAt(x, y);
        if (fgDark ? b < 128 : b > 128) {
          pts.push(p.createVector(x - w / 2, y - h / 2));
        }
      }
    }
    if (pts.length === 0) {
      for (let k = 0; k < 120; k++) {
        pts.push(p.createVector(p.random(-16, 16), p.random(-16, 16)));
      }
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const q of pts) {
      minX = Math.min(minX, q.x);
      maxX = Math.max(maxX, q.x);
      minY = Math.min(minY, q.y);
      maxY = Math.max(maxY, q.y);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    for (const q of pts) {
      q.x -= cx;
      q.y -= cy;
    }
    minX = Infinity;
    maxX = -Infinity;
    minY = Infinity;
    maxY = -Infinity;
    for (const q of pts) {
      minX = Math.min(minX, q.x);
      maxX = Math.max(maxX, q.x);
      minY = Math.min(minY, q.y);
      maxY = Math.max(maxY, q.y);
    }
    const bw = Math.max(1e-4, maxX - minX);
    const bh = Math.max(1e-4, maxY - minY);
    const halfSpan = Math.max(bw, bh) / 2;
    const s = (targetRadius / halfSpan) * radiusScale;
    for (const q of pts) {
      q.mult(s);
    }
    return pts;
  }

  function pickTargets(p, pool, count) {
    const out = [];
    if (pool.length >= count) {
      const idx = [];
      for (let i = 0; i < pool.length; i++) idx.push(i);
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(p.random(i + 1));
        const t = idx[i];
        idx[i] = idx[j];
        idx[j] = t;
      }
      for (let i = 0; i < count; i++) {
        out.push(pool[idx[i]].copy());
      }
    } else {
      for (let i = 0; i < count; i++) {
        out.push(pool[Math.floor(p.random(pool.length))].copy());
      }
    }
    return out;
  }

  function isOrbitNavMount(mountEl) {
    return !!(mountEl && mountEl.closest && mountEl.closest('#orbital-follow'));
  }

  /** Header nav on iacta / sonus / anima — logo centered, symmetric expansion. */
  function isCenteredHeaderNav(mountEl) {
    if (isOrbitNavMount(mountEl)) return false;
    const header = mountEl.closest('header[data-particle-nav="true"]');
    return !!(header && document.body && !document.body.classList.contains('index-page'));
  }

  /**
   * Горизонтальный сэмпл тёмных пикселей с offscreen canvas (index orbit nav).
   * sx — от левого края строки, sy — от вертикального центра канваса.
   */
  function sampleOrbitNavForParticles(p, caption) {
    const RH = 96;
    const g = document.createElement('canvas');
    g.width = 2048;
    g.height = RH;
    let gc = g.getContext('2d');
    if (!gc) return { items: [], totalTextWidth: 0, wordSpans: [] };
    gc.fillStyle = '#ffffff';
    gc.fillRect(0, 0, g.width, g.height);
    gc.fillStyle = '#000000';
    gc.font = '300 25px Helvetica Neue, Helvetica, Arial, sans-serif';
    gc.textBaseline = 'middle';
    gc.textAlign = 'left';
    try {
      gc.letterSpacing = '0.04em';
    } catch (e) {
      /* старые движки */
    }
    const totalTextWidth = gc.measureText(caption).width;
    const RW = Math.ceil(Math.min(2048, Math.max(320, totalTextWidth + 24)));
    g.width = RW;
    g.height = RH;
    gc = g.getContext('2d');
    if (!gc) return { items: [], totalTextWidth: 0, wordSpans: [] };
    gc.fillStyle = '#ffffff';
    gc.fillRect(0, 0, RW, RH);
    gc.fillStyle = '#000000';
    gc.font = '300 25px Helvetica Neue, Helvetica, Arial, sans-serif';
    gc.textBaseline = 'middle';
    gc.textAlign = 'left';
    try {
      gc.letterSpacing = '0.04em';
    } catch (e) {
      /* старые движки */
    }
    gc.fillText(caption, 0, RH / 2);

    const wordSpans = measureOrbitWordSpans(gc, caption, orbitNavWords());
    const img = gc.getImageData(0, 0, RW, RH);
    const data = img.data;
    const raw = [];
    const step = 1;
    for (let y = 0; y < RH; y += step) {
      for (let x = 0; x < RW; x += step) {
        const i = (y * RW + x) * 4;
        const br = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (br < 128) {
          const zone = zoneForOrbitSampleX(x, wordSpans);
          raw.push({ sx: x, sy: y - RH / 2, zone });
        }
      }
    }
    if (raw.length === 0) {
      for (let k = 0; k < 120; k++) {
        raw.push({
          sx: p.random(0, Math.max(80, totalTextWidth)),
          sy: p.random(-18, 18),
          zone: Math.floor(p.random(3)),
        });
      }
    }
    return { items: raw, totalTextWidth, wordSpans };
  }

  const ORBIT_NAV_HREFS = ['iacta.html', 'sonus.html', 'anima.html'];
  const ORBIT_NAV_WORDS_FALLBACK = ['IACTA', 'SONUS', 'ANIMA'];

  function orbitNavWords() {
    const i18n = window.MetanoiaI18n;
    if (i18n && typeof i18n.navWords === 'function') {
      const words = i18n.navWords();
      if (words && words.length === 3) return words;
    }
    return ORBIT_NAV_WORDS_FALLBACK.slice();
  }

  function measureOrbitWordSpans(gc, caption, words) {
    const navWords = words && words.length === 3 ? words : orbitNavWords();
    const spans = [];
    let cursor = 0;
    for (let wi = 0; wi < navWords.length; wi++) {
      const word = navWords[wi];
      const idx = caption.indexOf(word, cursor);
      if (idx < 0) continue;
      const prefix = caption.slice(0, idx);
      const start = gc.measureText(prefix).width;
      const end = start + gc.measureText(word).width;
      spans.push({ start, end, zone: wi });
      cursor = idx + word.length;
    }
    if (spans.length < 3) {
      const tw = Math.max(1, gc.measureText(caption).width);
      const third = tw / 3;
      return [
        { start: 0, end: third, zone: 0 },
        { start: third, end: third * 2, zone: 1 },
        { start: third * 2, end: tw, zone: 2 },
      ];
    }
    return spans;
  }

  function zoneForOrbitSampleX(x, wordSpans) {
    for (let i = 0; i < wordSpans.length; i++) {
      const sp = wordSpans[i];
      if (x >= sp.start && x < sp.end) return sp.zone;
    }
    return Math.min(2, Math.floor((x / Math.max(1, wordSpans[wordSpans.length - 1].end)) * 3));
  }

  function measureNavWordSpansFromLinks(gc, mountEl, caption) {
    const rest = mountEl.closest('.header-brand-rest');
    const links = rest ? [...rest.querySelectorAll('nav a')] : [];
    const spans = [];
    let cursor = 0;
    for (let wi = 0; wi < links.length; wi++) {
      let word = (links[wi].textContent || '').trim();
      if (!word) continue;
      const st = getComputedStyle(links[wi]).textTransform;
      if (st === 'uppercase') word = word.toUpperCase();
      else if (st === 'lowercase') word = word.toLowerCase();
      const idx = caption.indexOf(word, cursor);
      if (idx < 0) continue;
      const prefix = caption.slice(0, idx);
      const start = gc.measureText(prefix).width;
      const end = start + gc.measureText(word).width;
      spans.push({ start, end, zone: wi });
      cursor = idx + word.length;
    }
    if (spans.length < 3) {
      const tw = Math.max(1, gc.measureText(caption).width);
      const third = tw / 3;
      return [
        { start: 0, end: third, zone: 0 },
        { start: third, end: third * 2, zone: 1 },
        { start: third * 2, end: tw, zone: 2 },
      ];
    }
    return spans;
  }

  /**
   * Сэмпл нав-текста с зонами слов (anima / iacta / sonus).
   */
  function sampleNavTextPoolZoned(p, mountEl) {
    const rest = mountEl.closest('.header-brand-rest');
    const link = rest && rest.querySelector('nav a');
    const cs = link ? getComputedStyle(link) : null;
    const fontSize = Math.max(13, cs ? parseFloat(cs.fontSize) || 16 : 16);
    const fontWeight = cs ? parseInt(cs.fontWeight, 10) || 400 : 600;
    const fw = fontWeight >= 600 ? '600' : String(fontWeight);
    const rawFamily = (cs && cs.fontFamily) || 'Helvetica Neue, Helvetica, Arial, sans-serif';
    const primaryFam = rawFamily.split(',')[0].replace(/["']/g, '').trim() || 'Helvetica Neue';
    let letterPx = fontSize * 0.22;
    if (cs && cs.letterSpacing && cs.letterSpacing !== 'normal') {
      const ls = String(cs.letterSpacing).trim();
      if (ls.endsWith('px')) letterPx = parseFloat(ls) || letterPx;
      else if (ls.endsWith('em')) letterPx = (parseFloat(ls) || 0) * fontSize;
    }

    const caption = navCaptionForRaster(mountEl);
    const gw = 760;
    const gh = Math.max(44, Math.ceil(fontSize * 3.2));

    const mg = document.createElement('canvas');
    mg.width = gw;
    mg.height = gh;
    const mgc = mg.getContext('2d');
    if (!mgc) return { items: [], hrefs: [] };
    mgc.font = `${fw} ${fontSize}px ${primaryFam}, sans-serif`;
    mgc.textBaseline = 'middle';
    mgc.textAlign = 'left';
    try {
      mgc.letterSpacing = `${letterPx}px`;
    } catch (e) {
      /* старые движки */
    }
    mgc.fillText(caption, 0, gh / 2);
    const wordSpans = measureNavWordSpansFromLinks(mgc, mountEl, caption);
    const tw = mgc.measureText(caption).width;
    const offsetX = (gw - tw) / 2;

    const g = p.createGraphics(gw, gh);
    g.pixelDensity(1);
    g.background(255);
    const ctx = g.drawingContext;
    if (ctx && typeof ctx.fillText === 'function') {
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.font = `${fw} ${fontSize}px ${primaryFam}, sans-serif`;
      try {
        ctx.letterSpacing = `${letterPx}px`;
      } catch (e) {
        /* старые движки */
      }
      ctx.fillText(caption, gw / 2, gh / 2);
    }

    g.loadPixels();
    const px = g.pixels;
    const raw = [];
    const step = gw * gh > 500000 ? 2 : 1;
    function brightAt(x, y) {
      const i = 4 * (x + y * gw);
      return (px[i] + px[i + 1] + px[i + 2]) / 3;
    }
    for (let y = 0; y < gh; y += step) {
      for (let x = 0; x < gw; x += step) {
        if (brightAt(x, y) < 128) {
          raw.push({
            sx: x - gw / 2,
            sy: y - gh / 2,
            zone: zoneForOrbitSampleX(x - offsetX, wordSpans),
          });
        }
      }
    }
    if (raw.length === 0) {
      for (let k = 0; k < 80; k++) {
        raw.push({
          sx: p.random(-120, 120),
          sy: p.random(-16, 16),
          zone: Math.floor(p.random(3)),
        });
      }
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const q of raw) {
      minX = Math.min(minX, q.sx);
      maxX = Math.max(maxX, q.sx);
      minY = Math.min(minY, q.sy);
      maxY = Math.max(maxY, q.sy);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    for (const q of raw) {
      q.sx -= cx;
      q.sy -= cy;
    }
    g.remove();

    const hrefs = rest
      ? [...rest.querySelectorAll('nav a')].map((a) => a.getAttribute('href') || '')
      : ORBIT_NAV_HREFS.slice();
    return { items: raw, hrefs };
  }

  function pickOrbitSamples(p, items, count) {
    const out = [];
    if (items.length >= count) {
      const idx = [];
      for (let i = 0; i < items.length; i++) idx.push(i);
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(p.random(i + 1));
        const t = idx[i];
        idx[i] = idx[j];
        idx[j] = t;
      }
      for (let i = 0; i < count; i++) out.push(items[idx[i]]);
    } else {
      for (let i = 0; i < count; i++) {
        out.push(items[Math.floor(p.random(items.length))]);
      }
    }
    return out;
  }

  /** Прямоугольник кластера ссылок в координатах от левого верхнего угла mount (CSS px). */
  function measureNavClusterMountPx(mountEl) {
    const rest = mountEl.closest('.header-brand-rest');
    if (!rest) return null;
    const links = rest.querySelectorAll('nav a');
    if (!links.length) return null;
    const mr = mountEl.getBoundingClientRect();
    let L = Infinity;
    let T = Infinity;
    let R = -Infinity;
    let B = -Infinity;
    for (const a of links) {
      const r = a.getBoundingClientRect();
      L = Math.min(L, r.left);
      T = Math.min(T, r.top);
      R = Math.max(R, r.right);
      B = Math.max(B, r.bottom);
    }
    const w = R - L;
    const h = B - T;
    if (w < 2 || h < 2) return null;
    return {
      cx: (L + R) / 2 - mr.left,
      cy: (T + B) / 2 - mr.top,
      w,
      h,
    };
  }

  /** Текст ссылок с учётом text-transform (как на экране). */
  function navCaptionForRaster(mountEl) {
    const rest = mountEl.closest('.header-brand-rest');
    if (!rest) return 'SONUS  IACTA  ANIMA';
    const links = [...rest.querySelectorAll('nav a')];
    if (links.length !== 3) return 'SONUS  IACTA  ANIMA';
    return links
      .map((a) => {
        let t = (a.textContent || '').trim();
        if (!t) return '';
        const st = getComputedStyle(a).textTransform;
        if (st === 'uppercase') t = t.toUpperCase();
        else if (st === 'lowercase') t = t.toLowerCase();
        return t;
      })
      .filter(Boolean)
      .join('  ');
  }

  /**
   * Точки тёмных пикселей с тем же шрифтом/размером, что и nav (через canvas 2D + letterSpacing).
   * Масштаб и смещение к экрану — в rebuildNavTargets по bbox ссылок.
   */
  function sampleNavTextPool(p, mountEl) {
    const rest = mountEl.closest('.header-brand-rest');
    const link = rest && rest.querySelector('nav a');
    const cs = link ? getComputedStyle(link) : null;
    const fontSize = Math.max(13, cs ? parseFloat(cs.fontSize) || 16 : 16);
    const fontWeight = cs ? parseInt(cs.fontWeight, 10) || 400 : 600;
    const fw = fontWeight >= 600 ? '600' : String(fontWeight);
    const rawFamily = (cs && cs.fontFamily) || 'Helvetica Neue, Helvetica, Arial, sans-serif';
    const primaryFam = rawFamily.split(',')[0].replace(/["']/g, '').trim() || 'Helvetica Neue';
    let letterPx = fontSize * 0.22;
    if (cs && cs.letterSpacing && cs.letterSpacing !== 'normal') {
      const ls = String(cs.letterSpacing).trim();
      if (ls.endsWith('px')) letterPx = parseFloat(ls) || letterPx;
      else if (ls.endsWith('em')) letterPx = (parseFloat(ls) || 0) * fontSize;
    }

    const caption = navCaptionForRaster(mountEl);
    const gw = 760;
    const gh = Math.max(44, Math.ceil(fontSize * 3.2));

    const g = p.createGraphics(gw, gh);
    g.pixelDensity(1);
    g.background(255);

    const ctx = g.drawingContext;
    if (ctx && typeof ctx.fillText === 'function') {
      const centered = isCenteredHeaderNav(mountEl);
      ctx.textBaseline = 'middle';
      ctx.textAlign = centered ? 'center' : 'right';
      ctx.fillStyle = '#000000';
      ctx.font = `${fw} ${fontSize}px ${primaryFam}, sans-serif`;
      try {
        ctx.letterSpacing = `${letterPx}px`;
      } catch (e) {
        /* старые движки */
      }
      ctx.fillText(caption, centered ? gw / 2 : gw - 14, gh / 2);
    } else {
      const centered = isCenteredHeaderNav(mountEl);
      g.fill(0);
      g.noStroke();
      g.textAlign(centered ? p.CENTER : p.RIGHT, p.CENTER);
      g.textSize(fontSize);
      if (fw === '600') g.textStyle(p.BOLD);
      g.text(caption, centered ? gw / 2 : gw - 14, gh / 2);
    }

    g.loadPixels();
    const w = gw;
    const h = gh;
    const px = g.pixels;
    function brightAt(x, y) {
      const i = 4 * (x + y * w);
      return (px[i] + px[i + 1] + px[i + 2]) / 3;
    }
    const pts = [];
    const step = w * h > 500000 ? 2 : 1;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (brightAt(x, y) < 128) {
          pts.push(p.createVector(x - w / 2, y - h / 2));
        }
      }
    }
    if (pts.length === 0) {
      for (let k = 0; k < 80; k++) {
        pts.push(p.createVector(p.random(20, 120), p.random(-16, 16)));
      }
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const q of pts) {
      minX = Math.min(minX, q.x);
      maxX = Math.max(maxX, q.x);
      minY = Math.min(minY, q.y);
      maxY = Math.max(maxY, q.y);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    for (const q of pts) {
      q.x -= cx;
      q.y -= cy;
    }
    g.remove();
    return pts;
  }

  function createSketchForMount(mountEl) {
    return function particleSketch(p) {
      let imgs = [];
      let shapeTargets = [];
      let navTextTargets = [];
      let particles = [];
      let morphFrame = 0;
      let shapeIndex = 0;
      let hoverCanvas = false;
      let wasHovering = false;
      let canvasW = 280;
      let morphOx = -86;
      let morphOy = 0;
      let navTextOx = 92;
      let navTextOy = 0;
      let scatterSpeedVal = 22;
      let bleedPadX = BLEED_PAD_X;
      let bleedPadY = BLEED_PAD_Y;
      /** Границы слов в координатах канваса (после rebuild). */
      let orbitWordBounds = [];
      let orbitHoverZone = -1;
      let navParticleZones = null;
      const ORBIT_MOUNT_W = 72;
      /** Радиус hit-зоны лого (центр канваса = центр mount). */
      const ORBIT_LOGO_HIT_R = ORBIT_MOUNT_W * 0.52;
      const ORBIT_NAV_GAP = 0;
      const ORBIT_EDGE_PAD = 28;
      const ORBIT_HIT_PAD_X = 14;
      const ORBIT_HIT_PAD_Y = 22;
      const ATTR_NAV_TEXT = 0.032;
      const DAMP_HOVER = 0.91;
      const ATTR_NAV_ORBIT = 0.075;
      const DAMP_NAV_ORBIT = 0.78;
      /** Anima / Iacta / Sonus — быстрее index-морфа в текст нав. */
      const ATTR_NAV_CENTERED = 0.12;
      const DAMP_NAV_CENTERED = 0.74;
      const ATTR_MORPH_ORBIT_RETURN = 0.05;
      const DAMP_MORPH_ORBIT_RETURN = 0.74;
      const ORBIT_RETURN_BLEED_FRAMES = 12;
      let orbitMorphRelaxFrames = 0;

      function applyLayout() {
        let w;
        if (isOrbitNavMount(mountEl)) {
          w = Math.max(64, Math.min(560, mountEl.clientWidth || ORBIT_MOUNT_W));
          const vw = typeof window !== 'undefined' ? window.innerWidth : 960;
          bleedPadX = Math.max(0, (vw - w) * 0.5);
          bleedPadY = BLEED_PAD_Y;
        } else if (isCenteredHeaderNav(mountEl)) {
          w = Math.max(280, Math.min(780, mountEl.clientWidth || 320));
          const vw = typeof window !== 'undefined' ? window.innerWidth : 960;
          bleedPadX = Math.max(BLEED_PAD_X, (vw - w) * 0.5);
          bleedPadY = BLEED_PAD_Y;
        } else {
          w = Math.max(260, Math.min(560, mountEl.clientWidth || 320));
          bleedPadX = BLEED_PAD_X;
          bleedPadY = BLEED_PAD_Y;
        }
        canvasW = w;
        morphOx = isOrbitNavMount(mountEl) ? -0.28 * w : 0;
        morphOy = 0;
        scatterSpeedVal = 22 * ((canvasW + CANVAS_H) / 2 / 560) * 2.75;
      }

      function fullCanvasW() {
        return canvasW + 2 * bleedPadX;
      }

      function fullCanvasH() {
        return CANVAS_H + 2 * bleedPadY;
      }

      /** Центр расширенного канваса совпадает с центром mount (как у канваса без bleed). */
      function alignCanvasBleed() {
        const el = p.canvas;
        if (!el) return;
        el.style.position = 'relative';
        el.style.left = -bleedPadX + 'px';
        el.style.top = -bleedPadY + 'px';
        el.style.maxWidth = 'none';
      }

      function orbitZoneAtCanvasX(lx, ly) {
        const padX = ORBIT_HIT_PAD_X;
        const padY = ORBIT_HIT_PAD_Y;
        for (let z = 0; z < 3; z++) {
          const b = orbitWordBounds[z];
          if (!b) continue;
          if (
            lx >= b.minX - padX &&
            lx <= b.maxX + padX &&
            ly >= b.minY - padY &&
            ly <= b.maxY + padY
          ) {
            return z;
          }
        }
        for (let z = 0; z < 3; z++) {
          const b = orbitWordBounds[z];
          if (!b) continue;
          if (lx >= b.minX - padX && lx <= b.maxX + padX) return z;
        }
        return -1;
      }

      function orbitHrefForZone(z) {
        if (z < 0 || z > 2) return null;
        const b = orbitWordBounds[z];
        return (b && b.href) || ORBIT_NAV_HREFS[z] || null;
      }

      function orbitSetCanvasPointerEvents() {
        if (!p.canvas) return;
        p.canvas.style.setProperty('pointer-events', hoverCanvas ? 'auto' : 'none', 'important');
      }

      function orbitSetOrbitPause(paused) {
        if (typeof window.__metanoiaSetOrbitPause === 'function') {
          window.__metanoiaSetOrbitPause(paused);
        }
      }

      function orbitEnterNavHover() {
        orbitMorphRelaxFrames = 0;
        orbitHoverZone = -1;
        if (!hoverCanvas) rebuildOrbitNavTargets();
        hoverCanvas = true;
        orbitSetCanvasPointerEvents();
        orbitSetOrbitPause(true);
      }

      function orbitLeaveNavHover() {
        hoverCanvas = false;
        orbitHoverZone = -1;
        orbitMorphRelaxFrames = ORBIT_RETURN_BLEED_FRAMES;
        orbitSetCanvasPointerEvents();
        orbitSetOrbitPause(false);
      }

      function orbitPointerNearLogo(lx, ly) {
        return Math.hypot(lx, ly) <= ORBIT_LOGO_HIT_R;
      }

      function orbitPointerInNavArea(pt) {
        if (orbitZoneAtCanvasX(pt.lx, pt.ly) >= 0) return true;
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (let z = 0; z < 3; z++) {
          const b = orbitWordBounds[z];
          if (!b) continue;
          minX = Math.min(minX, b.minX);
          maxX = Math.max(maxX, b.maxX);
          minY = Math.min(minY, b.minY);
          maxY = Math.max(maxY, b.maxY);
        }
        if (minX === Infinity) return false;
        return (
          pt.lx >= minX - ORBIT_HIT_PAD_X &&
          pt.lx <= maxX + ORBIT_HIT_PAD_X &&
          pt.ly >= minY - ORBIT_HIT_PAD_Y &&
          pt.ly <= maxY + ORBIT_HIT_PAD_Y
        );
      }

      function orbitPointerToLocal(e) {
        const rect = p.canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return { lx: 0, ly: 0 };
        const scaleX = p.width / rect.width;
        const scaleY = p.height / rect.height;
        return {
          lx: (e.clientX - rect.left) * scaleX - p.width * 0.5,
          ly: (e.clientY - rect.top) * scaleY - p.height * 0.5,
        };
      }

      function orbitSyncNavHoverFromPointer(e) {
        if (!hoverCanvas) return;
        const pt = orbitPointerToLocal(e);
        if (orbitPointerInNavArea(pt) || orbitPointerNearLogo(pt.lx, pt.ly)) {
          orbitHoverZone = orbitZoneAtCanvasX(pt.lx, pt.ly);
        } else {
          orbitLeaveNavHover();
        }
      }

      function rebuildOrbitNavTargets() {
        const caption =
          mountEl.getAttribute('data-nav-caption') || 'IACTA      ·      SONUS      ·      ANIMA';
        const sampled = sampleOrbitNavForParticles(p, caption);
        let items = sampled.items;
        let totalTextWidth = sampled.totalTextWidth;
        const wordSpans = sampled.wordSpans || [];
        if (items.length < 40) {
          items = [];
          totalTextWidth = Math.max(320, totalTextWidth);
          for (let k = 0; k < 200; k++) {
            items.push({
              sx: p.random(0, totalTextWidth),
              sy: p.random(-18, 18),
              zone: Math.floor(p.random(3)),
            });
          }
        }

        const follow = mountEl.closest('#orbital-follow');
        const rect = follow
          ? follow.getBoundingClientRect()
          : { left: 0, width: ORBIT_MOUNT_W };
        const logoX = rect.left + rect.width / 2;
        const screenCX = window.innerWidth / 2;
        /** Лого в полуплоскости x+ → текст в сторону +x; в x− → в сторону −x. */
        const goRight = logoX >= screenCX;

        const LOGO_R = rect.width * 0.5;
        const halfW = p.width * 0.5 - ORBIT_EDGE_PAD;
        const halfH = p.height * 0.5 - ORBIT_EDGE_PAD;
        const availW = Math.max(40, halfW - LOGO_R - ORBIT_NAV_GAP);

        let s = 1;
        if (totalTextWidth > 0) {
          s = Math.min(1, availW / totalTextWidth);
        }
        let maxSy = 0;
        for (let j = 0; j < items.length; j++) {
          maxSy = Math.max(maxSy, Math.abs(items[j].sy));
        }
        if (maxSy > 0) {
          s = Math.min(s, halfH / maxSy);
        }
        s *= 0.9;

        const picked = pickOrbitSamples(p, items, N);
        navTextTargets = [];
        orbitWordBounds = [null, null, null];
        const zoneAgg = [
          { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
          { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
          { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
        ];

        for (let i = 0; i < N; i++) {
          const item = picked[i];
          const sx = item.sx * s;
          const ty = item.sy * s;
          let tx;
          if (goRight) {
            tx = LOGO_R + ORBIT_NAV_GAP + sx;
          } else {
            tx = -LOGO_R - ORBIT_NAV_GAP - totalTextWidth * s + sx;
          }
          navTextTargets.push(p.createVector(tx, ty));
          navParticleZones[i] = item.zone;
          const za = zoneAgg[item.zone];
          if (za) {
            za.minX = Math.min(za.minX, tx);
            za.maxX = Math.max(za.maxX, tx);
            za.minY = Math.min(za.minY, ty);
            za.maxY = Math.max(za.maxY, ty);
          }
        }
        for (let z = 0; z < 3; z++) {
          const a = zoneAgg[z];
          if (a && a.minX < Infinity) {
            orbitWordBounds[z] = {
              minX: a.minX,
              maxX: a.maxX,
              minY: a.minY,
              maxY: a.maxY,
              zone: z,
              href: ORBIT_NAV_HREFS[z],
            };
          }
        }
      }

      function rebuildCenteredNavTargets() {
        const sampled = sampleNavTextPoolZoned(p, mountEl);
        let items = sampled.items;
        if (items.length < 40) {
          items = [];
          for (let k = 0; k < 200; k++) {
            items.push({
              sx: p.random(-160, 160),
              sy: p.random(-18, 18),
              zone: Math.floor(p.random(3)),
            });
          }
        }

        let tminX = Infinity;
        let tmaxX = -Infinity;
        let tminY = Infinity;
        let tmaxY = -Infinity;
        for (let j = 0; j < items.length; j++) {
          tminX = Math.min(tminX, items[j].sx);
          tmaxX = Math.max(tmaxX, items[j].sx);
          tminY = Math.min(tminY, items[j].sy);
          tmaxY = Math.max(tmaxY, items[j].sy);
        }
        const blobW = Math.max(1e-4, tmaxX - tminX);
        const blobH = Math.max(1e-4, tmaxY - tminY);

        const dom = measureNavClusterMountPx(mountEl);
        let extraScale = 1;
        if (dom && dom.w > 4 && dom.h > 4) {
          extraScale = Math.min(dom.w / blobW, dom.h / blobH) * 0.9;
          navTextOx = dom.cx - canvasW / 2;
          navTextOy = dom.cy - CANVAS_H / 2;
        } else {
          navTextOx = 0;
          navTextOy = 0;
          extraScale = Math.min((canvasW * 0.88) / blobW, (CANVAS_H * 0.6) / blobH);
        }

        const picked = pickOrbitSamples(p, items, N);
        navTextTargets = [];
        orbitWordBounds = [null, null, null];
        if (!navParticleZones) navParticleZones = new Uint8Array(N);
        const zoneAgg = [
          { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
          { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
          { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
        ];
        const hrefs = sampled.hrefs || ORBIT_NAV_HREFS;

        for (let i = 0; i < N; i++) {
          const item = picked[i];
          const tx = item.sx * extraScale + navTextOx;
          const ty = item.sy * extraScale + navTextOy;
          navTextTargets.push(p.createVector(tx, ty));
          navParticleZones[i] = item.zone;
          const za = zoneAgg[item.zone];
          if (za) {
            za.minX = Math.min(za.minX, tx);
            za.maxX = Math.max(za.maxX, tx);
            za.minY = Math.min(za.minY, ty);
            za.maxY = Math.max(za.maxY, ty);
          }
        }
        for (let z = 0; z < 3; z++) {
          const a = zoneAgg[z];
          if (a && a.minX < Infinity) {
            orbitWordBounds[z] = {
              minX: a.minX,
              maxX: a.maxX,
              minY: a.minY,
              maxY: a.maxY,
              zone: z,
              href: hrefs[z] || ORBIT_NAV_HREFS[z],
            };
          }
        }
      }

      function rebuildNavTargets() {
        if (isOrbitNavMount(mountEl)) {
          rebuildOrbitNavTargets();
          return;
        }
        if (isCenteredHeaderNav(mountEl)) {
          rebuildCenteredNavTargets();
          return;
        }
        const navPool = sampleNavTextPool(p, mountEl);
        let tminX = Infinity;
        let tmaxX = -Infinity;
        let tminY = Infinity;
        let tmaxY = -Infinity;
        for (let j = 0; j < navPool.length; j++) {
          const q = navPool[j];
          tminX = Math.min(tminX, q.x);
          tmaxX = Math.max(tmaxX, q.x);
          tminY = Math.min(tminY, q.y);
          tmaxY = Math.max(tmaxY, q.y);
        }
        const blobW = Math.max(1e-4, tmaxX - tminX);
        const blobH = Math.max(1e-4, tmaxY - tminY);

        const dom = measureNavClusterMountPx(mountEl);
        let extraScale = 1;
        if (dom && dom.w > 4 && dom.h > 4) {
          extraScale = Math.min(dom.w / blobW, dom.h / blobH) * 0.9;
          navTextOx = dom.cx - canvasW / 2;
          navTextOy = dom.cy - CANVAS_H / 2;
        } else {
          navTextOx = 0;
          navTextOy = 0;
          const span = isCenteredHeaderNav(mountEl) ? 0.88 : 0.45;
          extraScale = Math.min((canvasW * span) / blobW, (CANVAS_H * 0.6) / blobH);
        }

        navTextTargets = pickTargets(p, navPool, N);
        for (let i = 0; i < N; i++) {
          navTextTargets[i].mult(extraScale);
          navTextTargets[i].add(navTextOx, navTextOy);
        }
      }

      function syncNavLayoutFromDom() {
        applyLayout();
        const fw = fullCanvasW();
        const fh = fullCanvasH();
        if (Math.abs(p.width - fw) > 0.5 || Math.abs(p.height - fh) > 0.5) {
          p.resizeCanvas(fw, fh);
        }
        alignCanvasBleed();
        rebuildNavTargets();
      }

      p.preload = function () {
        for (let i = 0; i < IMAGE_FILES.length; i++) {
          imgs.push(p.loadImage(IMG_BASE + IMAGE_FILES[i]));
        }
      };

      p.setup = function () {
        applyLayout();
        p.createCanvas(fullCanvasW(), fullCanvasH());
        p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
        alignCanvasBleed();

        const brand = mountEl.closest('.header-brand');
        const hoverRoot = brand || mountEl.closest('#orbital-follow');
        if (isOrbitNavMount(mountEl)) {
          navParticleZones = new Uint8Array(N);
          orbitSetCanvasPointerEvents();
          const followEl = mountEl.closest('#orbital-follow');
          function orbitNavigateFromPointer(e) {
            const pt = orbitPointerToLocal(e);
            const z = orbitZoneAtCanvasX(pt.lx, pt.ly);
            const href = orbitHrefForZone(z);
            if (!href) return false;
            e.preventDefault();
            e.stopPropagation();
            window.location.assign(href);
            return true;
          }
          const orbitHitRoots = [followEl, mountEl].filter(Boolean);
          orbitHitRoots.forEach(function (hitRoot) {
            hitRoot.addEventListener('pointerenter', function onOrbitHitEnter() {
              orbitEnterNavHover();
            });
            hitRoot.addEventListener('pointerleave', function onOrbitHitLeave(e) {
              if (
                p.canvas &&
                e.relatedTarget &&
                (hitRoot.contains(e.relatedTarget) || p.canvas.contains(e.relatedTarget))
              ) {
                return;
              }
              if (followEl && e.relatedTarget && followEl.contains(e.relatedTarget)) return;
              orbitLeaveNavHover();
            });
          });
          p.canvas.addEventListener('pointermove', orbitSyncNavHoverFromPointer);
          p.canvas.addEventListener('pointerleave', function onOrbitCanvasLeave(e) {
            if (!hoverCanvas) return;
            if (followEl && e.relatedTarget && followEl.contains(e.relatedTarget)) return;
            orbitLeaveNavHover();
          });
          p.canvas.addEventListener('pointerdown', function onOrbitNavPointerDown(e) {
            if (!hoverCanvas) return;
            orbitNavigateFromPointer(e);
          });
          p.canvas.addEventListener('click', function onOrbitNavCanvasClick(e) {
            if (!hoverCanvas) return;
            orbitNavigateFromPointer(e);
          });
        } else if (isCenteredHeaderNav(mountEl)) {
          navParticleZones = new Uint8Array(N);
          function syncCenteredNavHover(e) {
            if (!hoverCanvas || !p.canvas) return;
            const rect = p.canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const scaleX = p.width / rect.width;
            const scaleY = p.height / rect.height;
            const lx = (e.clientX - rect.left) * scaleX - p.width * 0.5;
            const ly = (e.clientY - rect.top) * scaleY - p.height * 0.5;
            orbitHoverZone = orbitZoneAtCanvasX(lx, ly);
          }
          hoverRoot.addEventListener('mouseenter', () => {
            hoverCanvas = true;
            orbitHoverZone = -1;
          });
          hoverRoot.addEventListener('mouseleave', () => {
            hoverCanvas = false;
            orbitHoverZone = -1;
          });
          hoverRoot.addEventListener('pointermove', syncCenteredNavHover);
          const rest = mountEl.closest('.header-brand-rest');
          if (rest) {
            const nav = rest.querySelector('nav');
            if (nav) nav.addEventListener('pointermove', syncCenteredNavHover);
          }
        } else if (hoverRoot) {
          hoverRoot.addEventListener('mouseenter', () => {
            hoverCanvas = true;
          });
          hoverRoot.addEventListener('mouseleave', () => {
            hoverCanvas = false;
          });
        } else {
          const cv = p.canvas;
          if (cv) {
            cv.addEventListener('mouseenter', () => {
              hoverCanvas = true;
            });
            cv.addEventListener('mouseleave', () => {
              hoverCanvas = false;
            });
          }
        }

        for (let i = 0; i < imgs.length; i++) {
          prepareImageForSampling(imgs[i]);
          const pool = sampleForeground(p, imgs[i], { targetRadius: SHAPE_RADIUS });
          shapeTargets.push(pickTargets(p, pool, N));
        }

        rebuildNavTargets();

        for (let i = 0; i < N; i++) {
          const h = shapeTargets[0][i].copy().add(morphOx, morphOy);
          particles.push({
            pos: h.copy(),
            vel: p.createVector(0, 0),
            home: h.copy(),
          });
        }

        function scheduleNavSync() {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => syncNavLayoutFromDom());
          });
        }
        mountEl.__particleNavSync = syncNavLayoutFromDom;
        if (!navSyncCallbacks.includes(syncNavLayoutFromDom)) {
          navSyncCallbacks.push(syncNavLayoutFromDom);
        }

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(scheduleNavSync).catch(scheduleNavSync);
        } else {
          scheduleNavSync();
        }
        window.addEventListener('load', scheduleNavSync, { once: true });

        let roTimer = 0;
        if (typeof ResizeObserver !== 'undefined') {
          const ro = new ResizeObserver(() => {
            window.clearTimeout(roTimer);
            roTimer = window.setTimeout(() => syncNavLayoutFromDom(), 40);
          });
          ro.observe(mountEl);
        }
      };

      function syncHomesToMorph() {
        const S = shapeTargets.length;
        const a = shapeIndex % S;
        const b = (shapeIndex + 1) % S;
        if (morphFrame < HOLD_FRAMES) {
          for (let i = 0; i < N; i++) {
            const v = shapeTargets[a][i];
            particles[i].home.set(v.x + morphOx, v.y + morphOy);
          }
        } else {
          const denom = Math.max(1, TRANS_FRAMES - 1);
          const t = p.constrain((morphFrame - HOLD_FRAMES) / denom, 0, 1);
          const tt = t * t * (3 - 2 * t);
          for (let i = 0; i < N; i++) {
            const ax = shapeTargets[a][i].x + morphOx;
            const ay = shapeTargets[a][i].y + morphOy;
            const bx = shapeTargets[b][i].x + morphOx;
            const by = shapeTargets[b][i].y + morphOy;
            particles[i].home.set(ax + (bx - ax) * tt, ay + (by - ay) * tt);
          }
        }
      }

      function tickMorph() {
        morphFrame++;
        if (morphFrame >= HOLD_FRAMES + TRANS_FRAMES) {
          morphFrame = 0;
          shapeIndex = (shapeIndex + 1) % shapeTargets.length;
        }
      }

      function scatterBurst() {
        for (let i = 0; i < N; i++) {
          const q = particles[i];
          let dir = p5.Vector.sub(q.pos, p.createVector(0, 0));
          if (dir.mag() < 1.5) {
            dir = p.createVector(p.cos((i / N) * p.TWO_PI), p.sin((i / N) * p.TWO_PI));
          } else {
            dir.normalize();
          }
          dir.mult(p.random(0.55, 1.2) * scatterSpeedVal);
          q.vel.add(dir);
        }
      }

      p.draw = function () {
        const orbitNav = isOrbitNavMount(mountEl);
        const centeredNav = isCenteredHeaderNav(mountEl);
        const fastNavMorph = (orbitNav || centeredNav) && hoverCanvas;
        const orbitMorphCoalesce =
          orbitNav && !hoverCanvas && orbitMorphRelaxFrames > 0;

        if (orbitNav && wasHovering && !hoverCanvas) {
          for (let i = 0; i < N; i++) {
            particles[i].vel.mult(0.2);
          }
        }

        if (centeredNav && wasHovering && !hoverCanvas) {
          for (let i = 0; i < N; i++) {
            particles[i].vel.mult(0.35);
          }
        }

        if (hoverCanvas && !wasHovering) {
          if (!orbitNav && !centeredNav) scatterBurst();
        }
        wasHovering = hoverCanvas;

        if (fastNavMorph) {
          for (let i = 0; i < N; i++) {
            particles[i].home.set(navTextTargets[i]);
          }
        } else if (!hoverCanvas) {
          syncHomesToMorph();
          tickMorph();
        } else {
          for (let i = 0; i < N; i++) {
            particles[i].home.set(navTextTargets[i]);
          }
        }

        p.clear();
        const rgb = themeRgb();
        p.stroke(rgb[0], rgb[1], rgb[2], 0.85 * 255);
        const cx = p.width / 2;
        const cy = p.height / 2;

        for (let i = 0; i < N; i++) {
          const q = particles[i];
          if (fastNavMorph) {
            const attr = centeredNav ? ATTR_NAV_CENTERED : ATTR_NAV_ORBIT;
            const damp = centeredNav ? DAMP_NAV_CENTERED : DAMP_NAV_ORBIT;
            const ax = p5.Vector.sub(q.home, q.pos).mult(attr);
            q.vel.add(ax);
            q.vel.mult(damp);
          } else if (hoverCanvas) {
            const ax = p5.Vector.sub(q.home, q.pos).mult(ATTR_NAV_TEXT);
            q.vel.add(ax);
            q.vel.mult(DAMP_HOVER);
          } else {
            const morphK = orbitMorphCoalesce ? ATTR_MORPH_ORBIT_RETURN : ATTR_MORPH;
            const morphD = orbitMorphCoalesce ? DAMP_MORPH_ORBIT_RETURN : DAMP_MORPH;
            const ax = p5.Vector.sub(q.home, q.pos).mult(morphK);
            q.vel.add(ax);
            q.vel.mult(morphD);
          }
          q.pos.add(q.vel);

          let ptW = 1.25;
          if (fastNavMorph) {
            ptW = 1.55;
            if (
              orbitHoverZone >= 0 &&
              navParticleZones &&
              navParticleZones[i] === orbitHoverZone
            ) {
              ptW = 2.45;
            }
          }
          p.strokeWeight(ptW);
          p.point(q.pos.x + cx, q.pos.y + cy);
        }

        if (orbitNav && !hoverCanvas && orbitMorphRelaxFrames > 0) {
          orbitMorphRelaxFrames--;
        }

        if (orbitNav && p.canvas) {
          let showPointer = false;
          if (hoverCanvas) {
            showPointer = true;
          } else if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            const lx = p.mouseX - p.width * 0.5;
            const ly = p.mouseY - p.height * 0.5;
            showPointer = orbitPointerNearLogo(lx, ly);
          }
          p.canvas.style.cursor = showPointer ? 'pointer' : '';
        }
      };
    };
  }

  hosts.forEach((mountEl) => {
    new p5(createSketchForMount(mountEl), mountEl);
  });

  window.__metanoiaRefreshParticleNav = function refreshParticleNav() {
    navSyncCallbacks.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.warn('[particle-nav] refresh failed', e);
      }
    });
  };
})();

const MANIFESTO_TEXT = `MANIFESTO

From interpretation of reality to participation in it. What appears as a cycle is a limitation of perception. Dawn and dusk, Birth and death, The yo-yo in the hand before the throw And the yo-yo returned to the hand, These are not repetitions. They are projections of divided thinking attempting to stabilize itself. Metanoia removes the division. Not by unifying concepts, but by eliminating the need for division altogether. It is enough to see that action is inseparable from the one who perceives it. Reality is neither constructed nor observed. It is encountered in interaction. And interaction is never abstract, it is always concrete, embodied, precise. An object is not a fixed entity. It is a condition within a relationship. Being is not a stable identity. It is a position within that same relationship. Only that which exists in interaction exists at all. The yo-yo is not cyclical. It becomes cyclical in the hands of one who repeats without awareness. In the hands of a master it is not a cycle, it is a controlled release and return of energy. Rotation is not essence. Rotation is suspension, A temporary state in which movement conceals structure. The moment of stillness is not the end of a trick. It is the moment in which structure becomes visible. Not because movement disappears, but because the illusion does. Mastery is not control over movement. It is clarity of interaction. The string is not a tool. It is an interface, The medium through which intention becomes material. It does not connect two separate objects. It defines the relationship in which both sides become distinguishable. To play beyond play. To be beyond being. There is only the moment in which rules cease to be mistaken for reality. To leave the game does not mean to abandon it, It means to stop confusing its structure with truth. Being does not arise from emptiness. It arises from precision. Silence is not absence. It is the state in which distortion is no longer sustained. The sound of one hand is not a paradox. It is a reminder that meaning does not require symmetry. Return is not repetition. Return is recognition. Divided thinking does not hold, Not because it is forbidden, But because it cannot maintain clarity. Metanoia is not belief. It is a discipline of perception. And perception, when disciplined, Does not withdraw from reality, It enters it.`;

const poem = Array.from(MANIFESTO_TEXT.replace(/\s+/g, ' ').trim());
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /iPhone|iPod|Android/i.test(navigator.userAgent);

let __p5Started = false;
window.addEventListener('load', () => {
  // If p5 failed to load or setup never ran, surface it.
  setTimeout(() => {
    if (!__p5Started) {
      console.warn('[anima] p5 sketch did not start (p5.js blocked or runtime error).');
    }
  }, 1200);
});

function hexToRgb(hex) {
  const h = String(hex || '').trim();
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  if (!m) return [245, 244, 240];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function getThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  const bg = cs.getPropertyValue('--bg').trim();
  const text = cs.getPropertyValue('--text').trim();
  return { bg: hexToRgb(bg), text: hexToRgb(text) };
}

function getHeaderOffsetPx() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim();
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function setup() {
  __p5Started = true;
  const container = document.getElementById('anima-canvas-container')
  const containerWidth = container ? container.clientWidth : window.innerWidth
  const containerHeight = container ? container.clientHeight : window.innerHeight
  const cnv = createCanvas(containerWidth, containerHeight)
  if (container) cnv.parent(container)
  
  textFont('Courier New')
  textStyle(BOLD)
  pixelDensity(1)
  frameRate(isMobile ? 40 : 60)
  noStroke()
  textAlign(LEFT, BASELINE)

  if (prefersReducedMotion) noLoop()
}

function draw(){
  if (prefersReducedMotion) return
  // OpenProcessing "things fall apart" logic (adapted):
  // - no solid background (we keep shared #bg)
  // - text is MANIFESTO
  clear()

  const { text: textRGB } = getThemeColors()
  const theme = document.documentElement.dataset.theme

  let alphabetP = 0
  const fspeed = frameCount / 20
  const bigT = width / 18
  const littleT = width / 36

  const stepY = isMobile ? 14 : 12
  const stepX = isMobile ? 8 : 6

  // If header is fixed, keep the effect below it.
  const topPad = Math.max(0, Math.ceil(getHeaderOffsetPx()));
  const innerH = Math.max(1, height - topPad);

  for (let y = topPad + 2; y < height - 2; y += stepY) {
    const yy = y - topPad;
    const flaming = map(yy, innerH, 0, 0.2, 0.8)
    for (let x = 2; x < width - 2; x += stepX) {
      const na = noise(x / 50, y / 100 + fspeed, fspeed)
      textSize(na < flaming ? na * littleT : na * bigT)

      const letter = poem[alphabetP % poem.length]
      if (letter !== ' ') {
        const a = (theme === 'dark' ? 80 : 60) + na * 120
        fill(textRGB[0], textRGB[1], textRGB[2], a)
        text(letter, x, y)
      }
      alphabetP++
    }
  }
}

function windowResized() {
  const container = document.getElementById('anima-canvas-container')
  const containerWidth = container ? container.clientWidth : window.innerWidth
  const containerHeight = container ? container.clientHeight : window.innerHeight
  resizeCanvas(containerWidth, containerHeight)
}

const MANIFESTO_BODY_HTML = `
<p>From interpretation of reality to participation in it. What appears as a cycle is a limitation of perception. Dawn and dusk, Birth and death, The yo-yo in the hand before the throw And the yo-yo returned to the hand, These are not repetitions. They are projections of divided thinking attempting to stabilize itself. Metanoia removes the division. Not by unifying concepts, but by eliminating the need for division altogether. It is enough to see that action is inseparable from the one who perceives it. Reality is neither constructed nor observed. It is encountered in interaction. And interaction is never abstract, it is always concrete, embodied, precise. An object is not a fixed entity. It is a condition within a relationship. Being is not a stable identity. It is a position within that same relationship. Only that which exists in interaction exists at all. The yo-yo is not cyclical. It becomes cyclical in the hands of one who repeats without awareness. In the hands of a master it is not a cycle, it is a controlled release and return of energy. Rotation is not essence. Rotation is suspension, A temporary state in which movement conceals structure. The moment of stillness is not the end of a trick. It is the moment in which structure becomes visible. Not because movement disappears, but because the illusion does. Mastery is not control over movement. It is clarity of interaction. The string is not a tool. It is an interface, The medium through which intention becomes material. It does not connect two separate objects. It defines the relationship in which both sides become distinguishable. To play beyond play. To be beyond being. There is only the moment in which rules cease to be mistaken for reality. To leave the game does not mean to abandon it, It means to stop confusing its structure with truth. Being does not arise from emptiness. It arises from precision. Silence is not absence. It is the state in which distortion is no longer sustained. The sound of one hand is not a paradox. It is a reminder that meaning does not require symmetry. Return is not repetition. Return is recognition. Divided thinking does not hold, Not because it is forbidden, But because it cannot maintain clarity. Metanoia is not belief. It is a discipline of perception. And perception, when disciplined, Does not withdraw from reality, It enters it.</p>
`;

const BRATISLAVA_BODY_HTML = `
<p>I woke up, today is 29.04.2026. Nearby. A great sunny day, a hangover. All night I tried to get rid of the feeling of helicopters — that sensation of the room spinning while I couldn't keep up. In the end I was sick in the morning, remnants of undigested wine. I went for breakfast and took everything fatty — beans, mushrooms, two eggs, Turkish spiral sausage, coffee and a chocolate bun. As we discussed pressing matters over breakfast, I started feeling better.</p>
<p>During lunch I was scrolling IG and came across a post that the European Yo-Yo Championship would be held in Bratislava that weekend, May 2–3. We had planned to fly home to Vilnius on the 1st, but this message planted the idea of changing our route. As a result we changed our tickets and were already in Bratislava on the 1st.</p>
<p>A separate moment — how I reacted. At first it seemed that the important thing was simply to go, look, research the community from the outside, not communicating, just observing, minimising contact with people. But in parallel another thought emerged — to try on the costume of a participant. Fear, strength, clarity and old age entered the room. Without thinking long I understood that the decision had already been made for me — registration for participants closed on the 28th while I was fighting nausea.</p>
<p>But this thought turned out to be radical. How do I relate to competition? As a lawyer I am always in a contest. Lawyers literally always argue and try to prove their client's case. But there is something deeper here. At the centre of the profession lies an agreement — an agreement on common law, a common cause and relations between people. Here it is something else. I don't know the rules. Literally don't know the rules.</p>
<p>Compete in what? By whose rules? Who accepted them? How to change them? Are they changeable at all? And if not — why do they apply to me?</p>
<p>We checked into the hotel close to midnight. On the way from the airport we ordered McDonald's to the room. After eating we fell asleep almost immediately.</p>
<p>02.05.2026. We woke up, got dressed and went for breakfast. Zoya chose a bistro near the hotel — we had three sausages served with mustard, an egg and a slice of bread, and finished by splitting a dessert resembling a large profiterole between us. The prices pleased us greatly.</p>
<p>Leaving the bistro we went for a walk around the city. Vova messaged me, asking whether the situation with the yo-yo had been resolved — his signature Hamr, which had broken while we were travelling in Norway. I was instantly split: one half of me was already in the world of yo-yo, while the other walked along Dunajska street trying to find the entrance to the old town.</p>
<p>We stumbled upon a blue cathedral and looked inside. A little later we came across a souvenir shop and chose a white rabbit holding an egg and riding a unicycle as a Christmas ornament. Then the market square — mushrooms, cheeses, wines, pastries, aromatic sausages. On the second floor: books, paintings, engravings. I was drawn to Alice in Wonderland. Then records and cassettes. Rummaging through a box I chose one, paid 10 euros — it became mine.</p>
<p>In the very corner of the second floor was a small children's stage. There was no one in front of it, only Zoya. I did a yo-yo trick, called a taxi, kissed her and left for the championship.</p>
<p>(…full text continues…)</p>
`;

const POSTS = [
  { title: 'Manifesto', date: '—', body: MANIFESTO_BODY_HTML },
  { title: 'Chapter I — Bratislava', date: '2026.05.04', body: BRATISLAVA_BODY_HTML },
  { title: '—', body: null },
  { title: '—', body: null },
  { title: '—', body: null },
  { title: '—', body: null },
];

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderBookshelf() {
  const host = document.getElementById('books');
  if (!host) return;
  host.innerHTML = '';

  POSTS.forEach((post, idx) => {
    const isReal = Boolean(post.body);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `anima-book${isReal ? ' is-real' : ' is-empty'}`;
    btn.dataset.postIndex = String(idx);
    btn.disabled = !isReal;
    btn.setAttribute('aria-label', post.title);
    btn.innerHTML = `<span class="anima-book-title">${escapeHtml(post.title)}</span>`;
    host.appendChild(btn);
  });
}

function openPost(idx) {
  const post = POSTS[idx];
  if (!post || !post.body) return;

  const popup = document.getElementById('post-popup');
  const date = document.getElementById('post-date');
  const title = document.getElementById('post-title');
  const body = document.getElementById('post-body');
  if (!popup || !date || !title || !body) return;

  date.textContent = post.date || '';
  title.textContent = post.title;
  body.innerHTML = post.body;

  popup.style.display = 'block';
  popup.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePost() {
  const popup = document.getElementById('post-popup');
  if (!popup) return;
  popup.style.display = 'none';
  popup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function wireBookshelf() {
  renderBookshelf();

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[data-close-popup]')) {
      closePost();
      return;
    }

    const book = target.closest('.anima-book');
    if (book && book instanceof HTMLElement) {
      const i = Number(book.dataset.postIndex);
      if (!Number.isNaN(i)) openPost(i);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePost();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireBookshelf);
} else {
  wireBookshelf();
}


/**
 * Metanoia — bilingual UI (EN / RU).
 * Markup: data-i18n, data-i18n-html, data-i18n-placeholder, data-i18n-aria, data-i18n-title
 * Page title: <html data-i18n-doc-title="page.index">
 */
(function () {
  const STORAGE_KEY = 'lang';

  const STRINGS = {
    en: {
      'brand.name': 'Μετάνοια',

      'page.index': 'Μετάνοια',
      'page.auth': 'Μετάνοια',
      'page.iacta': 'Μετάνοια — Iacta',
      'page.sonus': 'Μετάνοια — Sonus',
      'page.anima': 'Μετάνοια — Anima',

      'logo.aria': 'Μετάνοια — home',
      'nav.home': 'Μετάνοια',
      'nav.iacta': 'Iacta',
      'nav.sonus': 'Sonus',
      'nav.anima': 'Anima',
      'nav.caption': 'IACTA · SONUS · ANIMA',

      'theme.dark': 'Dark',
      'theme.light': 'Light',
      'lang.en': 'EN',
      'lang.ru': 'RU',
      'lang.switch': 'Language',
      'settings.menu': 'Settings',
      'settings.theme': 'Theme',
      'settings.bgParticles': 'Background particles',
      'settings.bgParticles.on': 'On',
      'settings.bgParticles.off': 'Off',

      'index.brand.title': 'Μετάνοια',
      'index.cover.line': 'From interpretation of reality to participation in it.',
      'index.bridge':
        'This is not content to consume. It is a discipline of perception, encountered through interaction.',
      'index.excerpt.p1': 'What appears as a cycle is a limitation of perception.',
      'index.excerpt.p2':
        'Dawn and dusk, birth and death, the yo-yo in the hand before the throw and the yo-yo returned to the hand, these are not repetitions.',
      'index.excerpt.p3': 'They are projections of divided thinking attempting to stabilize itself.',
      'index.manifesto.btn': 'Read the full manifesto',
      'index.manifesto.title': 'MANIFESTO',

      'auth.tab.enter': 'Enter',
      'auth.tab.join': 'Join',
      'auth.placeholder.email': 'email',
      'auth.placeholder.password': 'password',
      'auth.submit.enter': 'Enter →',
      'auth.submit.join': 'Join →',
      'auth.msg.confirm': 'Check your email to confirm.',

      'iacta.label': '— Iacta',
      'iacta.title': 'Iacta.',
      'iacta.note': 'This space is forming.',

      'anima.close': 'Close',

      'sonus.open.genesis': 'Open Metanoia Genesis',
      'sonus.open.tutorial': 'Open Metanoia Tutorial',
      'sonus.open.acid': 'Open Metanoia ACID',
      'sonus.open.circle': 'Open Metanoia Circle',
      'sonus.modal.title': 'Open CD case',
      'sonus.modal.close': 'Close',
      'sonus.booklet.line1': 'There is a point where roads cross.',
      'sonus.booklet.line2': 'There are places where steps begin.',
      'sonus.booklet.line3': 'There is a place where both are met.',

      'index.manifesto.body': `From interpretation of reality to participation in it.
What appears as a cycle is a limitation of perception.
Dawn and dusk,
Birth and death,
The yo-yo in the hand before the throw
And the yo-yo returned to the hand,
These are not repetitions.
They are projections of divided thinking attempting to stabilize itself.
Metanoia removes the division.
Not by unifying concepts, but by eliminating the need for division altogether.
It is enough to see that action is inseparable from the one who perceives it.
Reality is neither constructed nor observed.
It is encountered in interaction.
And interaction is never abstract,
it is always concrete, embodied, precise.
An object is not a fixed entity.
It is a condition within a relationship.
Being is not a stable identity.
It is a position within that same relationship.
Only that which exists in interaction exists at all.
The yo-yo is not cyclical.
It becomes cyclical in the hands of one who repeats without awareness.
In the hands of a master it is not a cycle, it is a controlled release and return of energy.
Rotation is not essence.
Rotation is suspension,
A temporary state in which movement conceals structure.
The moment of stillness is not the end of a trick.
It is the moment in which structure becomes visible.
Not because movement disappears, but because the illusion does.
Mastery is not control over movement.
It is clarity of interaction.
The string is not a tool.
It is an interface,
The medium through which intention becomes material.
It does not connect two separate objects.
It defines the relationship in which both sides become distinguishable.
To play beyond play.
To be beyond being.
There is only the moment in which rules cease to be mistaken for reality.
To leave the game does not mean to abandon it,
It means to stop confusing its structure with truth.
Being does not arise from emptiness.
It arises from precision.
Silence is not absence.
It is the state in which distortion is no longer sustained.
The sound of one hand is not a paradox.
It is a reminder that meaning does not require symmetry.
Return is not repetition.
Return is recognition.
Divided thinking does not hold,
Not because it is forbidden,
But because it cannot maintain clarity.
Metanoia is not belief.
It is a discipline of perception.
And perception, when disciplined,
Does not withdraw from reality,
It enters it.`,

      'anima.post.manifesto.title': 'MANIFESTO',
      'anima.post.chapter.title': 'CHAPTER I — BRATISLAVA',
    },

    ru: {
      'brand.name': 'Покаѧнїе',

      'page.index': 'Покаѧнїе',
      'index.brand.title': 'Покаѧнїе',
      'page.auth': 'Покаѧнїе',
      'page.iacta': 'Покаѧнїе — Мѣ́та',
      'page.sonus': 'Покаѧнїе — Зы́къ',
      'page.anima': 'Покаѧнїе — Дꙋ́хъ',

      'logo.aria': 'Покаѧнїе — начало',
      'nav.home': 'Покаѧнїе',
      'nav.iacta': 'Мѣ́та',
      'nav.sonus': 'Зы́къ',
      'nav.anima': 'Дꙋ́хъ',
      'nav.caption': 'Мѣ́та · Зы́къ · Дꙋ́хъ',

      'theme.dark': 'Тёмная',
      'theme.light': 'Светлая',
      'lang.en': 'EN',
      'lang.ru': 'RU',
      'lang.switch': 'Язык',
      'settings.menu': 'Настройки',
      'settings.theme': 'Тема',
      'settings.bgParticles': 'Фоновые частицы',
      'settings.bgParticles.on': 'Вкл',
      'settings.bgParticles.off': 'Выкл',

      'index.cover.line': 'От интерпретации реальности к участию в ней.',
      'index.bridge':
        'Это не контент для потребления. Это дисциплина восприятия, встречаемая через взаимодействие.',
      'index.excerpt.p1': 'То что кажется циклом является ограничением восприятия.',
      'index.excerpt.p2':
        'Рассвет и закат, рождение и смерть, йо-йо в руке до броска и йо-йо вернувшееся в руку не являются повторениями.',
      'index.excerpt.p3': 'Это проекции разделённого мышления пытающегося стабилизировать себя.',
      'index.manifesto.btn': 'Читать полный манифест',
      'index.manifesto.title': 'МАНИФЕСТ',

      'auth.tab.enter': 'Вход',
      'auth.tab.join': 'Регистрация',
      'auth.placeholder.email': 'email',
      'auth.placeholder.password': 'пароль',
      'auth.submit.enter': 'Войти →',
      'auth.submit.join': 'Создать →',
      'auth.msg.confirm': 'Проверьте почту для подтверждения.',

      'iacta.label': '— Iacta',
      'iacta.title': 'Iacta.',
      'iacta.note': 'Это пространство формируется.',

      'anima.close': 'Закрыть',

      'sonus.open.genesis': 'Открыть Metanoia Genesis',
      'sonus.open.tutorial': 'Открыть Metanoia Tutorial',
      'sonus.open.acid': 'Открыть Metanoia ACID',
      'sonus.open.circle': 'Открыть Metanoia Circle',
      'sonus.modal.title': 'Открытый CD-кейс',
      'sonus.modal.close': 'Закрыть',
      'sonus.booklet.line1': 'Есть точка, где сходятся дороги.',
      'sonus.booklet.line2': 'Есть места, где начинаются шаги.',
      'sonus.booklet.line3': 'Есть место, где встречаются оба.',

      'index.manifesto.body': `От интерпретации реальности к участию в ней.

То что кажется циклом является ограничением восприятия.
Рассвет и закат,
рождение и смерть,
йо-йо в руке до броска
и йо-йо вернувшееся в руку
не являются повторениями.
Это проекции разделённого мышления пытающегося стабилизировать себя.

Метанойя / Покаяние устраняет разделение.
Не путём объединения понятий, а путём устранения самой необходимости в разделении.
Достаточно увидеть что действие неотделимо от того кто его воспринимает.

Реальность не конструируется и не наблюдается.
Она встречается во взаимодействии.
И взаимодействие никогда не абстрактно.
Оно всегда конкретно, воплощено, точно.

Объект не является фиксированной сущностью.
Он является условием внутри отношения.
Бытие не является стабильной идентичностью.
Это позиция внутри того же отношения.
Существует лишь то что существует во взаимодействии.

Йо-йо не циклично.
Оно становится цикличным в руках того кто повторяет без осознанности.
В руках мастера это не цикл. Это контролируемое высвобождение и возврат энергии.

Вращение не является сутью.
Вращение является приостановкой,
временным состоянием в котором движение скрывает структуру.
Момент неподвижности является не концом трюка.
Это момент в котором структура становится видимой.
Не потому что движение исчезает. А потому что исчезает иллюзия.

Мастерство является не контролем над движением.
Это ясность взаимодействия.

Нить является не инструментом.
Это интерфейс,
среда через которую намерение становится материальным.
Она не соединяет два отдельных объекта.
Она определяет отношение в котором обе стороны становятся различимы.

Играть за пределами игры.
Быть за пределами бытия.
Есть только момент в котором правила перестают путаться с реальностью.
Покинуть игру не значит отказаться от неё.
Это значит перестать путать её структуру с истиной.

Бытие возникает не из пустоты.
Оно возникает из точности.

Тишина является не отсутствием.
Это состояние в котором искажение больше не поддерживается.

Звук хлопка одной ладони является не парадоксом.
Это напоминание о том что смысл не требует симметрии.

Возврат является не повторением.
Возврат является узнаванием.

Разделённое мышление не удерживается.
Не потому что это запрещено.
А потому что оно не может сохранять ясность.

Метанойя / Покаяние является не верой.
Это дисциплина восприятия.
И восприятие когда оно дисциплинировано
не отступает от реальности.
Оно входит в неё.`,

      'anima.post.manifesto.title': 'МАНИФЕСТ',
      'anima.post.chapter.title': 'ГЛАВА I — БРАТИСЛАВА',
    },
  };

  function detectDefaultLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ru') return saved;
    const nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('ru') ? 'ru' : 'en';
  }

  let currentLang = detectDefaultLang();

  function t(key) {
    const bundle = STRINGS[currentLang] || STRINGS.en;
    if (bundle[key] != null) return bundle[key];
    return STRINGS.en[key] != null ? STRINGS.en[key] : key;
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    const next = lang === 'ru' ? 'ru' : 'en';
    if (next === currentLang) return;
    currentLang = next;
    localStorage.setItem(STORAGE_KEY, next);
    apply();
    document.dispatchEvent(new CustomEvent('metanoia:langchange', { detail: { lang: next } }));
  }

  function applyDocTitle() {
    const key = document.documentElement.getAttribute('data-i18n-doc-title');
    if (key) document.title = t(key);
  }

  function navWords() {
    const words = [t('nav.iacta'), t('nav.sonus'), t('nav.anima')];
    if (currentLang === 'ru') return words;
    return words.map((w) => w.toUpperCase());
  }

  function navCaption() {
    return t('nav.caption');
  }

  function applyNavCaption() {
    const caption = navCaption();
    document.querySelectorAll('[data-nav-caption]').forEach((el) => {
      el.setAttribute('data-nav-caption', caption);
    });
  }

  function apply() {
    document.documentElement.lang = currentLang === 'ru' ? 'ru' : 'en';
    document.documentElement.dataset.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });

    applyNavCaption();
    applyDocTitle();
    updateSiteSettings();

    if (typeof window.__metanoiaRefreshParticleNav === 'function') {
      window.__metanoiaRefreshParticleNav();
    }

    if (typeof window.markActiveNav === 'function') {
      window.markActiveNav();
    }
  }

  function isIndexPage() {
    return !!(document.body && document.body.classList.contains('index-page'));
  }

  function removeLegacySettingsControls() {
    document.getElementById('lang-switcher')?.remove();
    document.querySelectorAll('.header-right .toggle, body > .toggle').forEach((el) => {
      if (!el.closest('.modal')) el.remove();
    });
    document.querySelectorAll('.header-right').forEach((el) => {
      if (!el.children.length) el.remove();
    });
  }

  function ensureSiteSettings() {
    const existing = document.getElementById('site-settings');
    if (existing) {
      const bgRow = document.getElementById('bg-particles-toggle')?.closest('.site-settings-row');
      if (bgRow && !isIndexPage()) bgRow.remove();
      return;
    }
    removeLegacySettingsControls();

    const root = document.createElement('div');
    root.id = 'site-settings';
    root.className = 'site-settings';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'site-settings-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-controls', 'site-settings-panel');
    trigger.setAttribute('aria-label', t('settings.menu'));
    trigger.innerHTML =
      '<span class="site-settings-trigger-dots" aria-hidden="true"><span></span><span></span><span></span></span>';

    const panel = document.createElement('div');
    panel.id = 'site-settings-panel';
    panel.className = 'site-settings-panel';
    panel.hidden = true;

    const langRow = document.createElement('div');
    langRow.className = 'site-settings-row';
    const langLabel = document.createElement('span');
    langLabel.className = 'site-settings-label';
    langLabel.dataset.i18n = 'lang.switch';
    langLabel.textContent = t('lang.switch');
    const langGroup = document.createElement('div');
    langGroup.className = 'site-settings-lang';
    langGroup.setAttribute('role', 'group');
    langGroup.setAttribute('aria-label', t('lang.switch'));
    ['en', 'ru'].forEach((code) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'site-settings-lang-btn';
      btn.dataset.lang = code;
      btn.textContent = t(code === 'en' ? 'lang.en' : 'lang.ru');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setLang(code);
      });
      langGroup.appendChild(btn);
    });
    langRow.append(langLabel, langGroup);

    const themeRow = document.createElement('div');
    themeRow.className = 'site-settings-row';
    const themeLabel = document.createElement('span');
    themeLabel.className = 'site-settings-label';
    themeLabel.dataset.i18n = 'settings.theme';
    themeLabel.textContent = t('settings.theme');
    const themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.className = 'toggle';
    themeBtn.setAttribute(
      'aria-pressed',
      document.documentElement.dataset.theme === 'dark' ? 'true' : 'false',
    );
    themeBtn.innerHTML =
      '<span class="toggle-label" id="theme-label"></span><div class="toggle-track"><div class="toggle-knob"></div></div>';
    themeRow.append(themeLabel, themeBtn);

    panel.append(langRow, themeRow);

    if (isIndexPage()) {
      const bgRow = document.createElement('div');
      bgRow.className = 'site-settings-row';
      const bgLabel = document.createElement('span');
      bgLabel.className = 'site-settings-label';
      bgLabel.dataset.i18n = 'settings.bgParticles';
      bgLabel.textContent = t('settings.bgParticles');
      const bgBtn = document.createElement('button');
      bgBtn.type = 'button';
      bgBtn.className = 'toggle toggle-bg-particles';
      bgBtn.id = 'bg-particles-toggle';
      bgBtn.innerHTML =
        '<span class="toggle-label" id="bg-particles-label"></span><div class="toggle-track"><div class="toggle-knob"></div></div>';
      bgRow.append(bgLabel, bgBtn);
      panel.append(bgRow);
    }

    root.append(trigger, panel);
    document.body.appendChild(root);

    function setOpen(open) {
      root.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!root.classList.contains('is-open'));
    });

    document.addEventListener('click', (e) => {
      if (!root.classList.contains('is-open')) return;
      if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) setOpen(false);
    });
  }

  function updateSiteSettings() {
    const root = document.getElementById('site-settings');
    if (!root) return;

    const trigger = root.querySelector('.site-settings-trigger');
    if (trigger) trigger.setAttribute('aria-label', t('settings.menu'));

    const langGroup = root.querySelector('.site-settings-lang');
    if (langGroup) {
      langGroup.setAttribute('aria-label', t('lang.switch'));
      langGroup.querySelectorAll('.site-settings-lang-btn').forEach((btn) => {
        const code = btn.dataset.lang;
        btn.setAttribute('aria-current', code === currentLang ? 'true' : 'false');
        btn.textContent = t(code === 'en' ? 'lang.en' : 'lang.ru');
      });
    }

    root.querySelectorAll('.site-settings-label[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    const theme = document.documentElement.dataset.theme || 'dark';
    root.querySelectorAll('.toggle:not(.toggle-bg-particles)').forEach((el) => {
      el.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });

    if (typeof window.applyBgParticlesToggleState === 'function') {
      window.applyBgParticlesToggleState();
    }
  }

  window.MetanoiaI18n = {
    t,
    getLang,
    setLang,
    apply,
    navWords,
    navCaption,
    ensureSiteSettings,
    updateSiteSettings,
    STRINGS,
  };

  function bootI18n() {
    apply();
    ensureSiteSettings();
  }

  if (document.body) bootI18n();
  else document.addEventListener('DOMContentLoaded', bootI18n);
})();

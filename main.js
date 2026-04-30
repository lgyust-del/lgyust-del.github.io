// =============================================================
// Park Yuna — static portfolio bootstrapping
//
// Responsibilities:
//   1. Load content from ./data.json
//   2. Render each section by data-bind / data-slot attributes
//   3. Add sticky-header scrolled state and section reveal motion,
//      respecting prefers-reduced-motion.
// =============================================================

const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const escapeHTML = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Resolve "a.b.c" against a nested object.
const resolvePath = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

// =============================================================
// Renderers
// =============================================================

function renderBindings(data) {
  $$('[data-bind]').forEach((el) => {
    const value = resolvePath(data, el.dataset.bind);
    if (value != null) el.textContent = value;
  });
}

function renderNav(data) {
  const slot = $('[data-slot="nav"]');
  if (!slot || !Array.isArray(data.nav)) return;
  slot.innerHTML = data.nav
    .map(
      (item) =>
        `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`,
    )
    .join('');
}

function renderHeroHeadline(data) {
  const slot = $('[data-slot="hero-headline"]');
  if (!slot) return;
  const { headlineBefore = '', headlineItalic = '', headlineAfter = '' } = data.hero || {};
  slot.innerHTML =
    `${escapeHTML(headlineBefore)}` +
    `<span class="italic-accent">${escapeHTML(headlineItalic)}</span>` +
    `${escapeHTML(headlineAfter)}`;
}

function renderHeroCtas(data) {
  const slot = $('[data-slot="hero-ctas"]');
  if (!slot || !data.hero) return;
  const { ctaPrimary, ctaSecondary } = data.hero;
  let html = '';
  if (ctaPrimary) {
    html += `<a class="btn" href="${escapeHTML(ctaPrimary.href)}">${escapeHTML(ctaPrimary.label)}</a>`;
  }
  if (ctaSecondary) {
    html += `<a class="link-inline" href="${escapeHTML(ctaSecondary.href)}">${escapeHTML(ctaSecondary.label)}</a>`;
  }
  slot.innerHTML = html;
}

function renderStats(data) {
  const slot = $('[data-slot="stats"]');
  if (!slot || !Array.isArray(data.stats)) return;
  slot.innerHTML = data.stats
    .map(
      (s) => `
        <li>
          <span class="stat-value">${escapeHTML(s.value)}</span>
          <span class="stat-caption">${escapeHTML(s.caption)}</span>
        </li>
      `,
    )
    .join('');
}

function renderValues(data) {
  const slot = $('[data-slot="values"]');
  const values = data.approach && data.approach.values;
  if (!slot || !Array.isArray(values)) return;
  slot.innerHTML = values
    .map(
      (v) => `
        <article class="value-card">
          <h3>${escapeHTML(v.title)}</h3>
          <p>${escapeHTML(v.body)}</p>
        </article>
      `,
    )
    .join('');
}

function renderProjects(data) {
  const slot = $('[data-slot="projects"]');
  const projects = data.work && data.work.projects;
  if (!slot || !Array.isArray(projects)) return;
  slot.innerHTML = projects
    .map((p, i) => {
      const mark = String(i + 1).padStart(2, '0');
      const img = p.image
        ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.imageAlt || p.name)}" loading="lazy" decoding="async" />`
        : '';
      return `
        <article class="project" data-size="${escapeHTML(p.size || 'small')}" data-tone="${escapeHTML(p.tone || 'neutral')}">
          <div class="project-cover">
            ${img}
            <span class="project-mark" aria-hidden="true">${mark}</span>
          </div>
          <p class="project-meta">${escapeHTML(p.brand)}</p>
          <h3 class="project-name">${escapeHTML(p.name)}</h3>
          <p class="project-blurb">${escapeHTML(p.blurb)}</p>
        </article>
      `;
    })
    .join('');
}

function renderPrinciples(data) {
  const slot = $('[data-slot="principles"]');
  const principles = data.philosophy && data.philosophy.principles;
  if (!slot || !Array.isArray(principles)) return;
  slot.innerHTML = principles
    .map(
      (pr) => `
        <li class="principle">
          <h3>${escapeHTML(pr.title)}</h3>
          <p>${escapeHTML(pr.body)}</p>
        </li>
      `,
    )
    .join('');
}

function renderContact(data) {
  const head = $('[data-slot="contact-headline"]');
  const ctas = $('[data-slot="contact-ctas"]');
  const c = data.contact || {};
  if (head) {
    head.innerHTML =
      `${escapeHTML(c.headlineBefore || '')}` +
      `<span class="italic-accent">${escapeHTML(c.headlineItalic || '')}</span>` +
      `${escapeHTML(c.headlineAfter || '')}`;
  }
  if (ctas) {
    let html = '';
    if (c.primary) {
      html += `<a class="btn" href="${escapeHTML(c.primary.href)}">${escapeHTML(c.primary.label)}</a>`;
    }
    if (c.secondary) {
      html += `<a class="link-inline" href="${escapeHTML(c.secondary.href)}">${escapeHTML(c.secondary.label)}</a>`;
    }
    ctas.innerHTML = html;
  }
}

function renderFooterLinks(data) {
  const slot = $('[data-slot="footer-links"]');
  if (!slot || !data.meta) return;
  const links = [];
  if (data.meta.email) {
    links.push({ label: 'Email', href: `mailto:${data.meta.email}` });
  }
  if (data.meta.portfolio) {
    links.push({ label: 'Portfolio', href: data.meta.portfolio });
  }
  if (data.meta.instagram) {
    links.push({ label: 'Instagram', href: data.meta.instagram });
  }
  slot.innerHTML = links
    .map((l) => `<a href="${escapeHTML(l.href)}" rel="noopener">${escapeHTML(l.label)}</a>`)
    .join('');
}

// =============================================================
// Motion: sticky header + section reveal
// =============================================================

function attachStickyHeader() {
  const header = $('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function attachReveal() {
  const targets = $$('.reveal');
  if (!targets.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );
  targets.forEach((el) => observer.observe(el));
}

// =============================================================
// Boot
// =============================================================

async function init() {
  let data;
  try {
    const res = await fetch('./data.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('[site] failed to load data.json:', err);
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<div style="position:fixed;top:0;left:0;right:0;padding:1rem;background:#2a1d1d;color:#f5d6d6;font:14px/1.5 system-ui;z-index:99">
         data.json을 불러오지 못했습니다. 로컬 서버(예: <code>python -m http.server 8000</code>)를 통해 열어 주세요.
       </div>`,
    );
    return;
  }

  renderBindings(data);
  renderNav(data);
  renderHeroHeadline(data);
  renderHeroCtas(data);
  renderStats(data);
  renderValues(data);
  renderProjects(data);
  renderPrinciples(data);
  renderContact(data);
  renderFooterLinks(data);

  attachStickyHeader();
  attachReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

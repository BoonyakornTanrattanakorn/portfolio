// Shared collection engine for card-grid pages (projects, websites).
//
// A "collection" is a manifest JSON (array of ids) plus one folder per id
// containing meta.json. Pages supply the paths and decide where a card links;
// everything else — search, sort, tag filters, error handling — is shared.
//
// initCollection({
//   manifest:  'projects/projects.json',   // manifest URL
//   base:      'projects/',                // folder holding each id/
//   noun:      'projects',                 // used in empty/error copy
//   cardHref:  (id, meta) => '...',        // where a card points
//   external:  false,                      // open in a new tab + mark as external
//   decorate:  (card, body, meta) => {},   // optional per-card extras
// })

(function (global) {
  function normalize(s) { return String(s || '').toLowerCase(); }

  function parseDateValue(d) {
    if (!d) return 0;
    const parsed = Date.parse(d);
    if (!Number.isNaN(parsed)) return parsed;
    const year = parseInt(d, 10);
    if (!Number.isNaN(year)) return new Date(year, 0, 1).getTime();
    return 0;
  }

  function debounce(fn, ms = 200) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  function thumbPlaceholder() {
    const ph = document.createElement('div');
    ph.className = 'card-thumb-placeholder';
    ph.textContent = 'No image';
    return ph;
  }

  function initCollection(config) {
    const {
      manifest,
      base,
      noun = 'items',
      cardHref,
      external = false,
      decorate,
    } = config;

    const grid = document.getElementById('project-grid');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const tagFilters = document.getElementById('tag-filters');
    if (!grid) return;

    let items = [];
    const selectedTags = new Set();

    function renderCard(id, meta) {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = cardHref(id, meta);
      card.setAttribute('aria-label', meta.title || id);
      if (external) {
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      }

      if (meta.thumbnail) {
        const img = document.createElement('img');
        img.className = 'card-thumb';
        img.src = `${base}${id}/${String(meta.thumbnail).trim()}`;
        img.alt = `${meta.title || id} thumbnail`;
        img.loading = 'lazy';
        img.onerror = () => {
          if (img.parentNode) img.parentNode.replaceChild(thumbPlaceholder(), img);
        };
        card.appendChild(img);
      } else {
        card.appendChild(thumbPlaceholder());
      }

      const body = document.createElement('div');
      body.className = 'card-body';

      const h3 = document.createElement('h3');
      h3.textContent = meta.title || id;
      if (external) {
        const mark = document.createElement('span');
        mark.className = 'ext-mark';
        mark.textContent = '↗';
        mark.setAttribute('aria-hidden', 'true');
        h3.appendChild(mark);
      }
      body.appendChild(h3);

      const metaDiv = document.createElement('div');
      metaDiv.className = 'card-meta';
      metaDiv.innerHTML = `${meta.date || ''} &nbsp;·&nbsp; ${meta.organization || ''} &nbsp;·&nbsp; ${meta.role || ''}`;
      body.appendChild(metaDiv);

      const p = document.createElement('p');
      p.textContent = meta.summary || '';
      body.appendChild(p);

      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'tags';
      (meta.tags || []).forEach((t) => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        tagsDiv.appendChild(span);
      });
      body.appendChild(tagsDiv);

      card.appendChild(body);
      if (typeof decorate === 'function') decorate(card, body, meta);
      return card;
    }

    function getAllTags(list) {
      const set = new Set();
      list.forEach((p) => (p.meta.tags || []).forEach((t) => set.add(t)));
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }

    function createTagFilters(tags) {
      if (!tagFilters) return;
      tagFilters.innerHTML = '';
      if (!tags.length) return;
      tags.forEach((t) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag-filter';
        btn.textContent = t;
        btn.dataset.tag = t;
        btn.addEventListener('click', () => {
          if (selectedTags.has(t)) selectedTags.delete(t); else selectedTags.add(t);
          btn.classList.toggle('active');
          render();
        });
        tagFilters.appendChild(btn);
      });
    }

    function matchesQuery(p, q) {
      if (!q) return true;
      q = normalize(q);
      if (normalize(p.meta.title).includes(q)) return true;
      if (normalize(p.meta.summary).includes(q)) return true;
      if (normalize(p.meta.organization).includes(q)) return true;
      if (normalize(p.meta.role).includes(q)) return true;
      for (const t of (p.meta.tags || [])) if (normalize(t).includes(q)) return true;
      return false;
    }

    function render() {
      const q = searchInput ? searchInput.value.trim() : '';
      const sort = sortSelect ? sortSelect.value : 'newest';

      const filtered = items.filter((p) => {
        if (p.error) return false;
        if (!matchesQuery(p, q)) return false;
        if (selectedTags.size > 0) {
          const tags = p.meta.tags || [];
          if (!Array.from(selectedTags).some((t) => tags.indexOf(t) !== -1)) return false;
        }
        return true;
      });

      filtered.sort((a, b) => {
        if (sort === 'az') return (a.meta.title || '').localeCompare(b.meta.title || '');
        if (sort === 'za') return (b.meta.title || '').localeCompare(a.meta.title || '');
        const da = parseDateValue(a.meta.date);
        const db = parseDateValue(b.meta.date);
        return sort === 'oldest' ? da - db : db - da;
      });

      grid.innerHTML = '';
      if (!filtered.length) {
        grid.innerHTML = `<p class="loading">No ${noun} found.</p>`;
        return;
      }
      filtered.forEach((p) => grid.appendChild(renderCard(p.id, p.meta)));
    }

    async function load() {
      try {
        const manifestRes = await fetch(manifest);
        if (!manifestRes.ok) throw new Error(`${manifest}: ${manifestRes.status}`);
        const ids = await manifestRes.json();

        items = await Promise.all(
          ids.map((id) =>
            fetch(`${base}${id}/meta.json`)
              .then((r) => { if (!r.ok) throw new Error(`${id}/meta.json: ${r.status}`); return r.json(); })
              .then((meta) => ({ id, meta }))
              .catch((err) => ({ id, error: err.message }))
          )
        );

        const errors = items.filter((p) => p.error);
        if (errors.length) {
          const errFrag = document.createDocumentFragment();
          errors.forEach((e) => {
            const el = document.createElement('p');
            el.className = 'error-msg';
            el.textContent = `Could not load "${e.id}": ${e.error}`;
            errFrag.appendChild(el);
          });
          grid.innerHTML = '';
          grid.appendChild(errFrag);
        }

        createTagFilters(getAllTags(items.filter((p) => !p.error)));
        render();
      } catch (err) {
        grid.innerHTML = `<p class="error-msg">Failed to load ${noun}: ${err.message}</p>`;
      }
    }

    if (searchInput) searchInput.addEventListener('input', debounce(render, 180));
    if (sortSelect) sortSelect.addEventListener('change', render);
    load();
  }

  global.initCollection = initCollection;
})(window);

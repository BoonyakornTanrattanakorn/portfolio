// Fetch meta.json and populate project page elements
(async function () {
  try {
    const res = await fetch('./meta.json');
    if (!res.ok) throw new Error('Failed to load meta.json');
    const meta = await res.json();

    const titleEl = document.getElementById('project-title');
    const metaEl = document.getElementById('project-meta');
    const tagsEl = document.getElementById('project-tags');
    const imgEl = document.getElementById('project-thumb');
    const captionEl = document.getElementById('project-thumb-caption');

    if (meta.title) {
      document.title = meta.title;
      if (titleEl) titleEl.textContent = meta.title;
    }

    const parts = [];
    if (meta.date) parts.push(meta.date);
    if (meta.organization) parts.push(meta.organization);
    if (meta.role) parts.push('Role: ' + meta.role);
    if (metaEl) metaEl.innerHTML = parts.join(' &nbsp;·&nbsp; ');

    if (Array.isArray(meta.tags) && tagsEl) {
      tagsEl.innerHTML = '';
      meta.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        tagsEl.appendChild(span);
      });
    }

    // placeholder SVG data URI for missing thumbnails
    const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">' +
        '<rect width="100%" height="100%" fill="#f3f4f6"/>' +
        '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="36">No image available</text>' +
      '</svg>'
    );

    if (imgEl) {
      imgEl.onerror = function () {
        if (imgEl.src !== placeholder) imgEl.src = placeholder;
      };

      if (meta.thumbnail) {
        imgEl.src = meta.thumbnail;
      } else {
        imgEl.src = placeholder;
      }

      imgEl.alt = meta.summary || meta.title || 'Project thumbnail';
      if (captionEl) captionEl.textContent = meta.summary || '';
    }
  } catch (err) {
    // Fail silently in production pages; log for debugging
    // eslint-disable-next-line no-console
    console.warn('meta-loader error:', err);
  }
})();

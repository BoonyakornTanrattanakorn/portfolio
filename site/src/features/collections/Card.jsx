import { useState } from 'react';
import { withBase } from '../../utils/paths.js';

export default function Card({
  item,
  href,
  isExternal = false,
  base = '/',
  mediaBase = '',
}) {
  const [imageError, setImageError] = useState(false);

  const itemId = item.id || item.slug;
  const title = item.title || itemId;
  const status = item.status ? String(item.status).toLowerCase() : null;
  const isArchived = status === 'archived';

  let thumbnailSrc = null;
  if (item.thumbnail && !imageError) {
    const rawThumb = String(item.thumbnail).trim();
    if (rawThumb.startsWith('http://') || rawThumb.startsWith('https://')) {
      thumbnailSrc = rawThumb;
    } else {
      thumbnailSrc = withBase(`${mediaBase}${itemId}/${rawThumb}`, base);
    }
  }

  const metaParts = [];
  if (item.date) metaParts.push(item.date);
  if (item.organization) metaParts.push(item.organization);
  if (item.role) metaParts.push(item.role);

  return (
    <a
      className={`card${isArchived ? ' is-archived' : ''}`}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={title}
    >
      {thumbnailSrc ? (
        <img
          className="card-thumb"
          src={thumbnailSrc}
          alt={`${title} thumbnail`}
          width="300"
          height="140"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="card-thumb-placeholder">No image</div>
      )}

      <div className="card-body">
        <h3>
          {title}
          {isExternal && (
            <span className="ext-mark" aria-hidden="true">
              ↗
            </span>
          )}
          {status && (
            <span className={`status-pill status-${status}`}>
              {item.status}
            </span>
          )}
        </h3>

        {metaParts.length > 0 && (
          <div className="card-meta">
            {metaParts.join(' \u00a0·\u00a0 ')}
          </div>
        )}

        <p>{item.summary || ''}</p>

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="tags">
            {item.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

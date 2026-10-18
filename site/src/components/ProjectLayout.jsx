import { useState } from 'react';
import { withBase } from '../utils/paths.js';

export const THUMBNAIL_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">' +
      '<rect width="100%" height="100%" fill="#f3f4f6"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" font-size="36">No image available</text>' +
    '</svg>'
  );

export default function ProjectLayout({
  title,
  date,
  organization,
  role,
  tags = [],
  thumbnail,
  summary,
  base = '/',
  children,
}) {
  const [imgError, setImgError] = useState(false);

  const metaParts = [];
  if (date) metaParts.push(date);
  if (organization) metaParts.push(organization);
  if (role) metaParts.push(`Role: ${role}`);

  const thumbSrc =
    thumbnail && !imgError ? thumbnail : THUMBNAIL_PLACEHOLDER;

  return (
    <div className="wrap">
      <a className="back" href={withBase('projects.html', base)}>
        ← Back to Portfolio
      </a>
      <h1 id="project-title">{title}</h1>
      <div id="project-meta" className="meta">
        {metaParts.join(' \u00a0·\u00a0 ')}
      </div>
      {tags.length > 0 && (
        <div id="project-tags" className="tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <figure className="inbody-figure">
        <img
          id="project-thumb"
          className="inbody-img thumbnail"
          src={thumbSrc}
          alt={summary || title || 'Project thumbnail'}
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {summary && <figcaption id="project-thumb-caption">{summary}</figcaption>}
      </figure>

      <div className="body">{children}</div>
    </div>
  );
}

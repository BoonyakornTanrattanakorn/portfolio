import { withBase } from '../utils/paths.js';

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
  const metaParts = [];
  if (date) metaParts.push(date);
  if (organization) metaParts.push(organization);
  if (role) metaParts.push(`Role: ${role}`);

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

      {thumbnail ? (
        <figure className="inbody-figure">
          <img
            id="project-thumb"
            className="inbody-img thumbnail"
            src={thumbnail}
            alt={summary || title || 'Project thumbnail'}
            loading="lazy"
          />
          {summary && <figcaption id="project-thumb-caption">{summary}</figcaption>}
        </figure>
      ) : (
        <figure className="inbody-figure">
          <div className="thumbnail-placeholder">No image available</div>
          {summary && <figcaption id="project-thumb-caption">{summary}</figcaption>}
        </figure>
      )}

      <div className="body">{children}</div>
    </div>
  );
}

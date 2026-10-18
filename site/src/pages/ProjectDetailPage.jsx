export default function ProjectDetailPage({ slug, title, summary, base = '/' }) {
  return (
    <article className="project-detail">
      <nav>
        <a href={`${base}projects.html`}>← Back to Portfolio</a>
      </nav>
      <header>
        <h1>{title || slug}</h1>
        {summary && <p className="lead">{summary}</p>}
      </header>
      <section className="body">
        <p>Project details for {slug}. Full narrative will be populated.</p>
      </section>
    </article>
  );
}

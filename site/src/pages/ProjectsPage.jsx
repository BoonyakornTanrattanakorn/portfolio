export default function ProjectsPage({ base = '/' }) {
  return (
    <div className="page projects-page">
      <h1>Portfolio</h1>
      <p className="lead">Selected projects and highlights.</p>
      <nav>
        <a href={`${base}index.html`}>Home</a>
      </nav>
      <section>
        <p>Project collection will load here.</p>
      </section>
    </div>
  );
}

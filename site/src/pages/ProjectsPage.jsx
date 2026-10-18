import AppLayout from '../components/AppLayout.jsx';

export default function ProjectsPage({ base = '/' }) {
  return (
    <AppLayout currentNav="projects" base={base}>
      <section>
        <h1 style={{ margin: '8px 0 4px' }}>Portfolio</h1>
        <p className="lead">Selected projects and highlights. Click a card to read more.</p>
      </section>

      <section className="grid" id="project-grid">
        <p className="loading">Loading projects…</p>
      </section>
    </AppLayout>
  );
}

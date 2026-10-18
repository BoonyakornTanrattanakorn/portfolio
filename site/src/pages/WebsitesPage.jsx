import AppLayout from '../components/AppLayout.jsx';

export default function WebsitesPage({ base = '/' }) {
  return (
    <AppLayout currentNav="websites" base={base}>
      <section>
        <h1 style={{ margin: '8px 0 4px' }}>Websites</h1>
        <p className="lead">Sites I&apos;ve built. Clicking a card opens the live site in a new tab.</p>
      </section>

      <section className="grid" id="project-grid">
        <p className="loading">Loading websites…</p>
      </section>
    </AppLayout>
  );
}

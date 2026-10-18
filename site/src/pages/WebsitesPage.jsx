export default function WebsitesPage({ base = '/' }) {
  return (
    <div className="page websites-page">
      <h1>Websites</h1>
      <p className="lead">Sites I have built.</p>
      <nav>
        <a href={`${base}index.html`}>Home</a>
      </nav>
      <section>
        <p>Websites collection will load here.</p>
      </section>
    </div>
  );
}

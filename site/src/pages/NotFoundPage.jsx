export default function NotFoundPage({ base = '/' }) {
  return (
    <div className="page not-found-page" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 — Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <p>
        <a href={`${base}index.html`}>Return to Home</a>
      </p>
    </div>
  );
}

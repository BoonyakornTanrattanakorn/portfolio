export default function NotFoundPage({ base = '/' }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main
        id="main-content"
        className="page not-found-page"
        tabIndex="-1"
        style={{ padding: '2rem', textAlign: 'center' }}
      >
        <h1>404 — Page Not Found</h1>
        <p>The page you requested could not be found.</p>
        <p>
          <a href={`${base}index.html`}>Return to Home</a>
        </p>
      </main>
    </>
  );
}

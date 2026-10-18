import AppLayout from '../components/AppLayout.jsx';
import { withBase } from '../utils/paths.js';

export default function CvPage({ base = '/' }) {
  const cvHtmlUrl = withBase('CV/Boonyakorn_Tanrattanakorn_CV.html', base);
  const cvPdfUrl = withBase('CV/Boonyakorn_Tanrattanakorn_CV.pdf', base);

  return (
    <AppLayout currentNav="cv" base={base}>
      <section
        className="cv-controls"
        aria-label="CV document links"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1 style={{ margin: '8px 0 4px', fontSize: '1.4rem' }}>Curriculum Vitae</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a
            href={cvHtmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.9rem', color: 'var(--link)', textDecoration: 'none', fontWeight: 500 }}
          >
            Direct HTML ↗
          </a>
          <a
            href={cvPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.9rem', color: 'var(--link)', textDecoration: 'none', fontWeight: 500 }}
          >
            Download PDF ↗
          </a>
        </div>
      </section>

      <iframe
        className="embed-frame"
        src={cvHtmlUrl}
        title="Curriculum Vitae of Boonyakorn Tanrattanakorn"
      />
    </AppLayout>
  );
}

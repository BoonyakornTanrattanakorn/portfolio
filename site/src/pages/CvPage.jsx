export default function CvPage({ base = '/' }) {
  return (
    <div className="page cv-page">
      <h1>Curriculum Vitae</h1>
      <p>
        <a href={`${base}CV/Boonyakorn_Tanrattanakorn_CV.pdf`} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      </p>
      <iframe
        className="embed-frame"
        src={`${base}CV/Boonyakorn_Tanrattanakorn_CV.html`}
        title="Curriculum Vitae"
      />
    </div>
  );
}

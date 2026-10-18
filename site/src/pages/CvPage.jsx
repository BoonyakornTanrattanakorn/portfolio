import AppLayout from '../components/AppLayout.jsx';

export default function CvPage({ base = '/' }) {
  return (
    <AppLayout currentNav="cv" base={base}>
      <iframe
        className="embed-frame"
        src={`${base}CV/Boonyakorn_Tanrattanakorn_CV.html`}
        title="Curriculum Vitae"
      />
    </AppLayout>
  );
}

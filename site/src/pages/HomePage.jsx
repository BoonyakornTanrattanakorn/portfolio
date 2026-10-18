import AppLayout from '../components/AppLayout.jsx';

export default function HomePage({ base = '/' }) {
  return (
    <AppLayout currentNav="home" base={base}>
      <div className="hero">
        <div>
          <h1>Boonyakorn Tanrattanakorn</h1>
          <p className="lead">Computer Engineering student · Embedded Systems &amp; FPGA · Full-Stack</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={`${base}projects.html`}>
              View Portfolio →
            </a>
            <a className="btn btn-secondary" href={`${base}cv.html`}>
              Read CV
            </a>
          </div>
        </div>
      </div>

      <section className="section-block">
        <h2>About</h2>
        <p>
          I am a Computer Engineering student at Chulalongkorn University who enjoys working
          close to the hardware — embedded systems, FPGAs, and signal/physics simulation —
          as well as shipping full-stack web applications end to end.
        </p>
      </section>
    </AppLayout>
  );
}

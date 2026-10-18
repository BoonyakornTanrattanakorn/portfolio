export default function HomePage({ base = '/' }) {
  return (
    <div className="page home-page">
      <h1>Boonyakorn Tanrattanakorn</h1>
      <p className="lead">Computer Engineering student · Embedded Systems &amp; FPGA · Full-Stack</p>
      <nav>
        <a href={`${base}projects.html`}>Portfolio</a> |{' '}
        <a href={`${base}profile.html`}>Profile</a> |{' '}
        <a href={`${base}websites.html`}>Websites</a> |{' '}
        <a href={`${base}cv.html`}>CV</a>
      </nav>
      <section>
        <h2>About</h2>
        <p>
          I am a Computer Engineering student at Chulalongkorn University who enjoys working
          close to the hardware as well as shipping full-stack web applications end to end.
        </p>
      </section>
    </div>
  );
}

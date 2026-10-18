export default function ProfilePage({ base = '/' }) {
  return (
    <div className="page profile-page">
      <h1>Profile — Boonyakorn Tanrattanakorn</h1>
      <p className="lead">Computer Engineering — Chulalongkorn University</p>
      <nav>
        <a href={`${base}index.html`}>About</a> |{' '}
        <a href={`${base}projects.html`}>Portfolio</a>
      </nav>
      <section>
        <h2>About</h2>
        <p>Embedded firmware (STM32/ESP32), FPGA design, and systems engineering.</p>
      </section>
    </div>
  );
}

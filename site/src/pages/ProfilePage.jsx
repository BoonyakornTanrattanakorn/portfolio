import AppLayout from '../components/AppLayout.jsx';

export default function ProfilePage({ base = '/' }) {
  return (
    <AppLayout currentNav="profile" base={base}>
      <header>
        <div>
          <h1>Boonyakorn Tanrattanakorn</h1>
          <div className="lead">Computer Engineering — Chulalongkorn University</div>
        </div>
      </header>

      <div className="body">
        <h2>About</h2>
        <p>
          I am an embedded firmware engineer and student focusing on STM32/ESP32 firmware, FPGA
          design, and systems engineering. I build end-to-end prototypes and research-grade
          projects.
        </p>

        <h2>Contact</h2>
        <p>
          Email: <a href="mailto:boonyakorn.tan@gmail.com">boonyakorn.tan@gmail.com</a>
        </p>
        <p>Location: Nonthaburi, Thailand</p>

        <h2>Links</h2>
        <ul>
          <li>
            <a href="https://github.com/BoonyakornTanrattanakorn" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/boonyakorn-tanrattanakorn/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={`${base}CV/Boonyakorn_Tanrattanakorn_CV.pdf`} target="_blank" rel="noopener noreferrer">
              Download CV (PDF)
            </a>
          </li>
        </ul>

        <h2>Highlights</h2>
        <ul>
          <li>Embedded firmware on STM32 (C/C++) and ESP32</li>
          <li>FPGA design (Verilog) and real-time systems</li>
          <li>PCB design, SMT assembly, and sensor integration</li>
        </ul>
      </div>
    </AppLayout>
  );
}

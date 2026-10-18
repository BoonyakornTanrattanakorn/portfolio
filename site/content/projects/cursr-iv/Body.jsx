import { withBase } from '../../../src/utils/paths.js';

export default function CursrIvBody({ base = '/' }) {
  const modelSrc = withBase('projects/cursr-iv/FC.glb', base);

  return (
    <>
      <model-viewer
        src={modelSrc}
        alt="CURSR-IV flight computer PCB"
        camera-controls=""
        auto-rotate=""
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '10px',
          background: '#e2e4e8',
          display: 'block',
        }}
      />

      <h2>Overview</h2>
      <p>
        CURSR-IV is a high-altitude research rocket developed by the Chulalongkorn University High
        Altitude Research Club. My primary contribution was the avionics stack: a custom 4-layer SMT
        flight computer designed entirely in KiCad and manufactured via JLCPCB.
      </p>

      <h2>Hardware</h2>
      <ul>
        <li>4-layer mixed-signal PCB (100 × 55 mm) with STM32F4 microcontroller</li>
        <li>Onboard IMU (LSM6DSO), barometer (BMP388), GPS, and pyro channels</li>
        <li>LoRa-based 915 MHz telemetry link (SX1276) with u.FL antenna connector</li>
        <li>USB-C power delivery and dedicated LDO rails for analog and digital domains</li>
      </ul>

      <h2>Firmware</h2>
      <ul>
        <li>Bare-metal C on STM32 HAL; sensor fusion via complementary filter</li>
        <li>State machine: idle → armed → boost → coast → apogee → recovery</li>
        <li>Telemetry framing with CRC-16, ground-station decode in Python</li>
      </ul>

      <h2>Social Media Presence</h2>
      <p>
        <a href="https://today.line.me/th/v3/article/yz9yZz1" target="_blank" rel="noopener noreferrer">
          https://today.line.me/th/v3/article/yz9yZz1
        </a>
      </p>
    </>
  );
}

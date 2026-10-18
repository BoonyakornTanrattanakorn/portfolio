import { withBase } from '../../../src/utils/paths.js';
import ModelViewer from '../../../src/components/ModelViewer.jsx';

export default function AutomatedMeasuringEquipmentBody({ base = '/' }) {
  const modelSrc = withBase('projects/automated-measuring-equipment/ame.glb', base);

  return (
    <>
      <ModelViewer
        src={modelSrc}
        alt="AMIv2 instrumentation PCB"
        cameraControls={true}
        autoRotate={true}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '10px',
          background: '#e2e4e8',
        }}
        base={base}
      />

      <h2>Overview</h2>
      <p>
        AMIv2 (Aircraft Monitoring &amp; Instrumentation) is the onboard data system for our
        Chulalongkorn University High Altitude Research Club entry to the Air Cargo Challenge 2026.
        As Head of Avionics, I designed a custom 2-layer STM32 board that measures power, motion,
        altitude, and GPS throughout a flight, computes the competition score in real time, and logs
        everything to an SD card for post-flight analysis.
      </p>

      <h2>Hardware</h2>
      <p>A compact 2-layer PCB designed in KiCad, built around an STM32 microcontroller:</p>
      <table>
        <thead>
          <tr>
            <th>Sensor</th>
            <th>Part</th>
            <th>Measures</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>6-axis IMU</td>
            <td>BMI160</td>
            <td>Acceleration &amp; rotation</td>
          </tr>
          <tr>
            <td>Barometer</td>
            <td>BMP280</td>
            <td>Altitude &amp; temperature</td>
          </tr>
          <tr>
            <td>Power monitor</td>
            <td>INA226</td>
            <td>Bus voltage &amp; current</td>
          </tr>
          <tr>
            <td>GNSS</td>
            <td>u-blox GPS</td>
            <td>Position, speed &amp; distance</td>
          </tr>
        </tbody>
      </table>

      <h2>Firmware</h2>
      <ul>
        <li>
          FreeRTOS-based firmware in C++ (STM32CubeIDE + HAL), with each sensor running on its own task.
        </li>
        <li>Kalman filtering to smooth noisy sensor signals into clean flight data.</li>
        <li>
          A flight-phase state machine (idle → climbing → distance → landing) that adapts logging
          rates from 1 Hz on the ground to 100 Hz in flight.
        </li>
        <li>
          Real-time competition score computed in-flight from distance, payload, and a current-draw
          penalty.
        </li>
        <li>
          SD-card logging to CSV, with the board doubling as a USB drive so logs can be pulled off the
          aircraft directly.
        </li>
      </ul>
    </>
  );
}

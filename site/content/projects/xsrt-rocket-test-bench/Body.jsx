import { withBase } from '../../../src/utils/paths.js';

export default function XsrtRocketTestBenchBody({ base = '/' }) {
  return (
    <>
      <h2>Overview</h2>
      <p>
        CUHAR (Chulalongkorn University High Altitude Rocketry) / XSRT is developing a static hot-fire
        test bench for a hybrid solid-liquid rocket engine. The system coordinates remote propellant filling,
        sensor acquisition, valve actuation, and ignition from an operator bunker 300 meters away.
      </p>
      <p>
        As the Avionics and Embedded Systems Lead, my work focused on the test stand&apos;s electrical architecture,
        distributed 500 kbit/s CAN bus node infrastructure, and remote ground control integration.
      </p>

      <h2>Subsystems</h2>
      <ul>
        <li>
          <strong>
            <a href={withBase('projects/ematch-ignition-module/index.html', base)}>
              Dual-Channel E-Match Ignition Module
            </a>
            :
          </strong>{' '}
          Custom KiCad PCB with a 3 mF capacitive discharge bank (~5.9 A peak), active supply decoupling,
          and mechanical relay isolation for safe remote pyrotechnic ignition. (See full project writeup).
        </li>
        <li>
          <strong>Servo-Actuated Ball Valves (SABV):</strong> CAN-connected actuator nodes controlling
          high-pressure valves with limit switch feedback and autonomous safe-state homing.
        </li>
        <li>
          <strong>Stand Electronic Control Unit (ECU):</strong> Embedded controller managing sensor
          acquisition, communications, and safety interlocks.
        </li>
        <li>
          <strong>Ground Control Station (GCS):</strong> Real-time telemetry monitoring and sequence
          control interface.
        </li>
      </ul>

      <p style={{ marginTop: '28px', color: 'var(--muted)', fontStyle: 'italic' }}>
        Full case study and documentation in progress.
      </p>
    </>
  );
}

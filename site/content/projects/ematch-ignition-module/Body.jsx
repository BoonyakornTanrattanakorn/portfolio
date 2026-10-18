import { withBase } from '../../../src/utils/paths.js';
import ProjectFigure from '../../../src/components/ProjectFigure.jsx';

export default function EmatchIgnitionModuleBody({ base = '/' }) {
  const modelSrc = withBase('projects/ematch-ignition-module/ignition_module.glb', base);
  const mosfetImg = withBase('projects/ematch-ignition-module/weirdly_hot_mosfet.jpg', base);
  const scopeImg = withBase('projects/ematch-ignition-module/oscilloscope_test.jpg', base);
  const dummyImg = withBase('projects/ematch-ignition-module/dummy_load_test.jpg', base);

  return (
    <>
      <model-viewer
        src={modelSrc}
        alt="3D interactive model of the XSRT E-Match Ignition Module PCB"
        camera-controls=""
        auto-rotate=""
        camera-orbit="0deg 75deg 105%"
        min-camera-orbit="auto auto 10%"
        max-camera-orbit="auto auto 300%"
        shadow-intensity="1"
        style={{
          width: '100%',
          height: '420px',
          borderRadius: '10px',
          background: 'var(--border)',
          margin: '16px 0 24px',
          display: 'block',
        }}
      />

      <h2>Overview</h2>
      <p className="demo-note" style={{ marginTop: '-6px', marginBottom: '14px' }}>
        Subsystem of the{' '}
        <a href={withBase('projects/xsrt-rocket-test-bench/index.html', base)}>
          <strong>XSRT Hybrid Rocket Engine Test Bench</strong>
        </a>{' '}
        project.
      </p>
      <p>
        I designed and built this dual-channel ignition module for the CUHAR / XSRT hybrid rocket engine
        static fire test stand. In rocket test operations, pyrotechnic ignition is high-stakes: an accidental
        firing pulse endangers anyone working near the stand, while a sluggish or hanging controller leaves
        unburned propellants in a hot combustion chamber.
      </p>
      <p>
        The module sits on the test stand&apos;s 500 kbit/s CAN bus (as Node <code>0x20</code>), receives arming
        and firing commands from mission control, checks pyrotechnic e-match continuity, and delivers a controlled
        ~5.9 A pulse to ignite the engine.
      </p>

      <h2>Circuit Design &amp; Power Architecture</h2>
      <p>
        Standard bench power supplies hate pyrotechnics. Firing a typical 2 Ω electric match draws around
        6 A nearly instantaneously. If pulled directly from the shared 12 V power supply, the voltage collapses,
        brownout-resetting nearby pressure transducers, load cells, and microcontrollers right at ignition.
      </p>
      <ul>
        <li>
          <strong>Capacitive Discharge Reservoir:</strong> Instead of pulling pulse current from the main bus,
          each channel charges a local <strong>3 mF capacitor bank</strong> (3× 1,000 µF) to 12 V.
        </li>
        <li>
          <strong>Power Supply Decoupling:</strong> During firing, an active NMOS switch cuts off the 12 V bench rail entirely.
          The ~5.9 A discharge dumps strictly from the local capacitors, so the rest of the test stand instrumentation never sees a dip.
        </li>
        <li>
          <strong>Mechanical Relay Isolation:</strong> Physical relays sit between the firing rail and the squib terminals.
          Until an explicit ARM command settles, the terminal is physically disconnected from high voltage—even if firmware halts
          or gate drivers leak.
        </li>
        <li>
          <strong>Active Safety Bleeder:</strong> When disarmed or in an emergency abort, an auxiliary discharge circuit
          automatically bleeds the 3 mF capacitor bank down below 0.3 V in about 300 ms, leaving the board safe to handle.
        </li>
        <li>
          <strong>Digital Continuity Check:</strong> Integrated sense lines let the STM32 check whether an e-match is physically
          connected before allowing arming.
        </li>
      </ul>

      <h2>Bench Bring-Up &amp; Debugging War Stories</h2>
      <p>
        Taking the board from KiCad into physical hardware came with a few tricky bugs that simulations didn&apos;t catch:
      </p>

      <h3>1. The Inductive Spike &amp; Thermal Camera Catch</h3>
      <p>
        During the first discharge test into a dummy load, Channel 1 fired once successfully. But immediately afterward,
        the capacitor bank wouldn&apos;t charge past 8 V, and the circuit drew a continuous 50 mA leakage.
      </p>
      <p>
        Pointing an infrared thermal camera at the board revealed that the low-side MOSFET (Q17) was running hot at idle (reaching 54.5 °C).
        The squib lead wires had just enough parasitic inductance that the rapid <em>di/dt</em> during cutoff created an inductive
        voltage spike. That spike exceeded the MOSFET&apos;s ±12 V <em>V<sub>gs</sub></em> limit and punctured the gate oxide, leaving it
        partially conductive. Swapping to a MOSFET with higher gate-source breakdown headroom and adding transient suppression
        fixed it completely.
      </p>

      <ProjectFigure
        src={mosfetImg}
        alt="Thermal camera capture showing damaged MOSFET heating up to 54.5°C while idle"
        caption="Thermal imaging of the damaged low-side MOSFET heating up to 54.5 °C at idle due to gate oxide puncture from inductive flyback."
      />

      <ProjectFigure
        src={scopeImg}
        alt="Oscilloscope trace measuring firing pulse transition"
        caption="Probing the output pulse on a Hantek DSO2D15: Verifying clean, sub-microsecond edge transitions and supply cutoff behavior during discharge."
      />

      <h3>2. The CubeMX CAN Bit-Timing Silent Trap</h3>
      <p>
        During initial communications bring-up, the board refused to join the CAN bus. Checking the STM32CubeMX auto-generated
        timing revealed that for a requested 500 kbit/s baud on the 36 MHz APB1 peripheral clock, CubeMX had defaulted to{' '}
        <code>Prescaler=16, BS1=1TQ, BS2=1TQ</code>:
      </p>
      <p className="eq">
        Baud = 36 MHz / (16 × 3 TQ) = 750 kbit/s
      </p>
      <p>
        The peripheral was silently running at 750 kbit/s instead of 500 kbit/s, and auto-retransmission was disabled by default.
        Recalculating the bit timing to <code>Prescaler=4, BS1=15TQ, BS2=2TQ</code> gave an exact 500 kbit/s rate with an 88.9%
        sample point, bringing the CAN node online immediately.
      </p>

      <ProjectFigure
        src={dummyImg}
        alt="Benchtop test setup with STM32 BluePill and 2.0 Ohm dummy load resistor"
        caption="Benchtop verification setup: Dual-channel ignition PCB populated with BluePill STM32, Mini360 buck converter, and a 2.0 Ω ceramic power resistor dummy load (no live pyrotechnics on the desk)."
      />

      <h3>3. Eliminating Floating Continuity Pins</h3>
      <p>
        Early prototype firmware assumed continuity could be read as active-low with floating inputs (<code>GPIO_NOPULL</code>).
        When no squib was plugged in, the disconnected terminal picked up ambient electrostatic noise and intermittently toggled
        between HIGH and LOW. Switching to an active-high circuit with internal pull-downs (<code>GPIO_PULLDOWN</code>) ensured
        disconnected squibs solidly read 0 V.
      </p>

      <h2>KiCad to SPICE Python Pipeline</h2>
      <p>
        Rather than manually redrawing the schematic in LTspice and Falstad CircuitJS to test capacitor sizing and gate drive
        timing, I wrote a Python parser that reads the KiCad <code>.kicad_sch</code> S-expression files directly.
      </p>
      <p>
        The script converts the schematic sheets and wire junctions into an interactive Falstad circuit for browser visualization,
        and generates LTspice netlists populated with realistic manufacturer VDMOS and BJT models. Running batch simulations
        confirmed the 3 mF capacitor bank delivers ~0.21 J into a 2 Ω squib within 50 ms before ever soldering a component.
      </p>

      <h2>Firmware Failsafes</h2>
      <p>
        The firmware runs bare-metal C++17 on the STM32F103, designed with a few critical safety rules:
      </p>
      <ul>
        <li>
          <strong>Hardware Timer Cutoff (TIM2):</strong> The 250 ms firing pulse isn&apos;t managed with a software delay loop.
          A hardware one-shot timer triggers an interrupt service routine that deasserts the gate directly, so the pulse will
          turn off even if the main loop hangs.
        </li>
        <li>
          <strong>ECU Deadman Heartbeat:</strong> Mission control broadcasts a periodic heartbeat frame (<code>0x001</code>).
          If more than 3 seconds pass without a heartbeat, the module immediately disarms, dumps the capacitor bank through the
          active bleeder, and latches off.
        </li>
        <li>
          <strong>Sub-Millisecond Emergency Abort:</strong> An emergency stop broadcast (<code>0x010</code>) drops the firing lines
          in under 1 ms.
        </li>
      </ul>
    </>
  );
}

export default function FpgaVideoPlayerBody() {
  return (
    <>
      <h2>Overview</h2>
      <p>
        Implemented an end-to-end FPGA image display system on the Digilent Basys 3 (Xilinx Artix-7).
        The design reads raw 320×240 frames from a microSD card via SPI and renders them on a VGA monitor in real time.
        All RTL is written in synthesizable Verilog and built with Xilinx Vivado.
      </p>

      <h2>Demo</h2>
      <div className="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/p0MyfT0LiCs"
          title="FPGA Video Demo"
          allowFullScreen
        />
      </div>
      <p className="demo-note">
        Final project for 2110363 Hardware Synthesis Lab I, Chulalongkorn University. Video frames are
        320×240 pixels at 12-bit colour stored as raw frames on the SD card and read over SPI (50 MHz).
        Output is driven over VGA; recorded playback was slightly sped up to match the original music video.
      </p>
      <p>
        Watch on YouTube:{' '}
        <a
          href="https://www.youtube.com/watch?v=p0MyfT0LiCs"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.youtube.com/watch?v=p0MyfT0LiCs
        </a>
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>
          <strong>MicroSD Interface</strong> — SPI-based SD master controller (sd_master.v) for block-level reads.
        </li>
        <li>
          <strong>VGA Signal Generation</strong> — Custom VGA sync module producing H-sync, V-sync and blanking intervals.
        </li>
        <li>
          <strong>Image Rendering</strong> — 320×240 pixel pipeline from SD block reads to pixel output.
        </li>
        <li>
          <strong>Image Switching</strong> — Hardware button to switch between stored images on the SD card.
        </li>
        <li>
          <strong>Top-Level Integration</strong> — Modular top module (TopModule.v) that ties Feeder, Controller, VGA, and SD subsystems together.
        </li>
      </ul>

      <h2>Technical Stack</h2>
      <ul>
        <li>Verilog — RTL design, simulation, and synthesis (majority of code).</li>
        <li>Python / Jupyter — Image preprocessing and binary/COE generation for SD content.</li>
        <li>Tcl — Vivado project scripting and build automation.</li>
        <li>Tools: Xilinx Vivado, Basys 3 board, XDC constraint for pin mapping.</li>
      </ul>

      <h2>Repository Structure</h2>
      <pre>
        {`src/
├── TopModule.v       # Top-level integration module
├── sd_master.v       # SPI SD card controller
├── VGASync.v         # VGA horizontal/vertical sync generator
├── Controller.v      # System state machine & control logic
└── Feeder.v          # Pixel data feeder to VGA output

bin generator/        # Python scripts for image → binary conversion
coe/                  # Memory initialization files (.coe)
sim/                  # Testbenches and simulation files
utils/                # Utility scripts
top.xdc               # Basys 3 pin constraint file`}
      </pre>

      <h2>What I Learned</h2>
      <ul>
        <li>Implemented SPI in Verilog to interface with a microSD card without IP cores.</li>
        <li>Designed a VGA controller from first principles, handling pixel clock and blanking correctly.</li>
        <li>Built a robust data pipeline from SD block reads → pixel buffering → VGA raster output.</li>
        <li>Used Python tooling to prepare image data and automated Vivado flows with Tcl.</li>
      </ul>

      <p>
        Repository: <em>2110363-HW-SYN-LAB/2-2024-final-project-jarnyam</em>
      </p>
    </>
  );
}

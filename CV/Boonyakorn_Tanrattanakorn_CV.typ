// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.1.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Boonyakorn Tanrattanakorn",
  footer: context { [#emph[Boonyakorn Tanrattanakorn -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Last updated in Mar 2026] ],
  locale-catalog-language: "en",
  page-size: "us-letter",
  page-top-margin: 0.7in,
  page-bottom-margin: 0.7in,
  page-left-margin: 0.7in,
  page-right-margin: 0.7in,
  page-show-footer: false,
  page-show-top-note: true,
  colors-body: rgb(0, 0, 0),
  colors-name: rgb(0, 0, 0),
  colors-headline: rgb(0, 0, 0),
  colors-connections: rgb(0, 0, 0),
  colors-section-titles: rgb(0, 0, 0),
  colors-links: rgb(0, 0, 0),
  colors-footer: rgb(128, 128, 128),
  colors-top-note: rgb(128, 128, 128),
  typography-line-spacing: 0.6em,
  typography-alignment: "justified",
  typography-date-and-location-column-alignment: right,
  typography-font-family-body: "XCharter",
  typography-font-family-name: "XCharter",
  typography-font-family-headline: "XCharter",
  typography-font-family-connections: "XCharter",
  typography-font-family-section-titles: "XCharter",
  typography-font-size-body: 10pt,
  typography-font-size-name: 25pt,
  typography-font-size-headline: 10pt,
  typography-font-size-connections: 10pt,
  typography-font-size-section-titles: 1.2em,
  typography-small-caps-name: false,
  typography-small-caps-headline: false,
  typography-small-caps-connections: false,
  typography-small-caps-section-titles: false,
  typography-bold-name: false,
  typography-bold-headline: false,
  typography-bold-connections: false,
  typography-bold-section-titles: true,
  links-underline: true,
  links-show-external-link-icon: false,
  header-alignment: center,
  header-photo-width: 3.5cm,
  header-space-below-name: 0.7cm,
  header-space-below-headline: 0.7cm,
  header-space-below-connections: 0.7cm,
  header-connections-hyperlink: true,
  header-connections-show-icons: false,
  header-connections-display-urls-instead-of-usernames: true,
  header-connections-separator: "|",
  header-connections-space-between-connections: 0.5cm,
  section-titles-type: "with_full_line",
  section-titles-line-thickness: 0.5pt,
  section-titles-space-above: 0.5cm,
  section-titles-space-below: 0.3cm,
  sections-allow-page-break: true,
  sections-space-between-text-based-entries: 0.15cm,
  sections-space-between-regular-entries: 0.42cm,
  entries-date-and-location-width: 4.15cm,
  entries-side-space: 0cm,
  entries-space-between-columns: 0.1cm,
  entries-allow-page-break: false,
  entries-short-second-row: false,
  entries-summary-space-left: 0cm,
  entries-summary-space-above: 0.08cm,
  entries-highlights-bullet:  text(13pt, [•], baseline: -0.6pt) ,
  entries-highlights-nested-bullet:  text(13pt, [•], baseline: -0.6pt) ,
  entries-highlights-space-left: 0cm,
  entries-highlights-space-above: 0.08cm,
  entries-highlights-space-between-items: 0.08cm,
  entries-highlights-space-between-bullet-and-text: 0.3em,
  date: datetime(
    year: 2026,
    month: 3,
    day: 4,
  ),
)


= Boonyakorn Tanrattanakorn

#connections(
  [Nonthaburi, Thailand],
  [#link("mailto:boonyakorn.tan@gmail.com", icon: false, if-underline: false, if-color: false)[boonyakorn.tan\@gmail.com]],
  [#link("tel:+66-89-926-2211", icon: false, if-underline: false, if-color: false)[089 926 2211]],
)


== Education

#education-entry(
  [
    #strong[Chulalongkorn University], BE in Computer Engineering -- Bangkok, Thailand

  ],
  [
    Sept 2023 – present

  ],
  main-column-second-row: [
    - GPA: 3.91\/4.00

    - #strong[Relevant Coursework]: Introduction to Robotics (A), Hardware Synthesis Lab (A), Embedded System Laboratory (A), Data Structures (A), Algorithm Design (A), Software Engineering (A)

  ],
)

== Projects

#regular-entry(
  [
    #strong[Project CURSR-III]

  ],
  [
    Jan 2023

  ],
  main-column-second-row: [
    #summary[Chulalongkorn University High Altitude Research Club | Avionics Engineer]

    - Designed and developed a telemetry ground station using #strong[ESP32] and #strong[LoRa].

    - Designed and assembled 2-layer throughhole #strong[PCB] for ground station using #strong[KiCad].

    - Participated in the fly-off team at the #strong[Spaceport America Cup 2024] in USA.

  ],
)

#regular-entry(
  [
    #strong[Project CURSR-IV]

  ],
  [
    Jan 2024

  ],
  main-column-second-row: [
    #summary[Chulalongkorn University High Altitude Research Club | Avionics Engineer]

    - Designed and assembled a 4-layer SMT flight computer #strong[PCB] using #strong[KiCad].

    - Developed embedded firmware on #strong[STM32 (C\/C++)] for sensor integration, telemetry, and flight control.

    - Built a #strong[LoRa]-based mesh network ground station using #strong[ESP32] and MQTT for telemetry diversity.

    - Modeled and simulated an active airbrake control system in #strong[Simulink].

    - Participated in the fly-off team at the #strong[International Rocket Engineering Competition 2025] in USA.

  ],
)

#regular-entry(
  [
    #strong[Project XSRT]

  ],
  [
    Jan 2025

  ],
  main-column-second-row: [
    #summary[Chulalongkorn University High Altitude Research Club | Electrical Engineer]

    - Developed an R&D web application using #strong[Next.js] and #strong[Tailwind CSS] for a hybrid propulsion test bench user interface.

    - Deployed #strong[Flask] backend on #strong[Raspberry Pi 5] to control the test bench.

  ],
)

#regular-entry(
  [
    #strong[FPGA Real-Time Video Player]

  ],
  [
    Jan 2025

  ],
  main-column-second-row: [
    #summary[Academic Project | Verilog]

    - Implemented a real-time FPGA (Basys-3) video player in #strong[Verilog] with VGA output.

    - Developed an SPI-based SD card controller to stream 320x240 RGB frames into dual-port RAM.

  ],
)

#regular-entry(
  [
    #strong[Smoothed Particle Hydrodynamics Simulator]

  ],
  [
    Jan 2025

  ],
  main-column-second-row: [
    #summary[Personal Project | Godot]

    - Built a real-time 2D fluid dynamics simulator in #strong[Godot Engine] using the SPH computational method written in #strong[GDScript].

    - Implemented GPU-accelerated physics calculations with #strong[GLSL compute shaders] for density and pressure force computations.

  ],
)

#regular-entry(
  [
    #strong[Weather Station]

  ],
  [
    Jan 2025

  ],
  main-column-second-row: [
    #summary[Embedded System Lab I (2110366), Chulalongkorn University | Embedded System Programmer]

    - Developed #strong[STM32] firmware in #strong[C] to interface with DHT11 temperature\/humidity, LDR light, and water level sensors via ADC and a custom one-wire protocol.

    - Designed a compact binary UART data packet protocol for STM32–#strong[ESP32-S3] communication with checksum validation.

    - Implemented #strong[ESP32-S3] firmware to publish sensor data to a cloud #strong[MQTT] broker (Eclipse Mosquitto) and control a servo motor rain gauge reset via #strong[PWM].

  ],
)

== Technical Skills

#strong[Embedded Systems:] Integrated Circuits, SMT, PCB Design & Assembly, STM32 & ESP32 Programming, FPGA Programming

#strong[Programming:] Python, C, C\#, C++, Java, Verilog

#strong[CAD:] Fusion 360, KiCad

#strong[Languages:] Thai: Native, English: IELTS 7.5, Japanese: JLPT N4

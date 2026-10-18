/**
 * Shared portfolio identity and contact information.
 */

export const PROFILE = {
  name: 'Boonyakorn Tanrattanakorn',
  headline: 'Computer Engineering student · Embedded Systems & FPGA · Full-Stack',
  subtitle: 'Computer Engineering · Chulalongkorn University',
  location: 'Nonthaburi, Thailand',
  email: 'boonyakorn.tan@gmail.com',
  social: {
    github: 'https://github.com/BoonyakornTanrattanakorn',
    linkedin: 'https://www.linkedin.com/in/boonyakorn-tanrattanakorn/',
  },
  cv: {
    html: 'CV/Boonyakorn_Tanrattanakorn_CV.html',
    pdf: 'CV/Boonyakorn_Tanrattanakorn_CV.pdf',
  },
  avatar: {
    // Local copy of profile avatar
    src: 'assets/avatar.jpg',
    // Fallback/remote URL for reference
    remoteSrc:
      'https://media.licdn.com/dms/image/v2/D5603AQEQGrzVBFih9Q/profile-displayphoto-scale_400_400/B56ZuRTigjJcAk-/0/1767669377827?e=1793836800&v=beta&t=B8Ipi5LafP6Y2n9BXm6AyiV4DUIUaj1ZjJ0nEMoP5FI',
    alt: 'Boonyakorn Tanrattanakorn',
  },
  about: [
    "I'm a Computer Engineering student at Chulalongkorn University who enjoys working close to the hardware — embedded systems, FPGAs, and signal/physics simulation — as well as shipping full-stack web applications end to end. The projects below span avionics, FPGA video, sensor stations, physics simulation, and a full-stack web app.",
  ],
  profileAbout:
    "I'm an embedded firmware engineer and student focusing on STM32/ESP32 firmware, FPGA design, and systems engineering. I build end-to-end prototypes and research-grade projects.",
  highlights: [
    'Embedded firmware on STM32 (C/C++) and ESP32',
    'FPGA design (Verilog) and real-time systems',
    'PCB design, SMT assembly, and sensor integration',
  ],
};

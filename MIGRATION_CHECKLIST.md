# React Migration Baseline & Checklist

## 1. Branch & Baseline Setup
- **Branch:** `feat/react-portfolio-port`
- **Initial Working Tree:** Baseline `site/` static site unmodified.
- **Node Environment:** Node v24.15.0, npm 12.2.0.

---

## 2. Required Page Paths Beneath Deployment Base
Beneath base `/portfolio/` (production) or `/` (local):
1. `/` and `/index.html` (Landing / About page)
2. `/profile.html` (Profile / Contact page)
3. `/projects.html` (Portfolio gallery)
4. `/websites.html` (Websites gallery)
5. `/cv.html` (CV viewer page)
6. `/404.html` (Static 404 fallback page)
7. Project Detail Pages (both explicit `/projects/<slug>/index.html` and directory URL `/projects/<slug>/`):
   - `/projects/xsrt-rocket-test-bench/` & `/projects/xsrt-rocket-test-bench/index.html`
   - `/projects/ematch-ignition-module/` & `/projects/ematch-ignition-module/index.html`
   - `/projects/engineering-internship/` & `/projects/engineering-internship/index.html`
   - `/projects/cursr-iv/` & `/projects/cursr-iv/index.html`
   - `/projects/fpga-video-player/` & `/projects/fpga-video-player/index.html`
   - `/projects/weather-station/` & `/projects/weather-station/index.html`
   - `/projects/sph-simulator/` & `/projects/sph-simulator/index.html`
   - `/projects/thamroi/` & `/projects/thamroi/index.html`
   - `/projects/automated-measuring-equipment/` & `/projects/automated-measuring-equipment/index.html`
8. Document Artifacts:
   - `/CV/Boonyakorn_Tanrattanakorn_CV.html`
   - `/CV/Boonyakorn_Tanrattanakorn_CV.pdf`

---

## 3. Metadata Inventory
- **Project manifest count:** 9 projects in `projects.json` (explicit order: `xsrt-rocket-test-bench`, `ematch-ignition-module`, `engineering-internship`, `cursr-iv`, `fpga-video-player`, `weather-station`, `sph-simulator`, `thamroi`, `automated-measuring-equipment`).
- **Website manifest count:** 2 websites in `websites.json` (`BandResistorColorCodeCalculator`, `ACC26FlightDataVisualization`).
- **Total `meta.json` files:** 11.
- **Unique project skill tags:** 36 tags across 9 projects.
  - Frequency leader: `STM32` (5), `C++` (3), `Embedded` (3), `KiCad` (3), `PCB` (3), `CAN Bus` (2), `ESP32` (2).
- **Unique website tags:** 9 tags (`CSS`, `Chart.js`, `GitHub Pages`, `HTML`, `JavaScript`, `Python`, `SVG`, `Three.js`, `pandas`).

---

## 4. Referenced Media Inventory
- **Favicon:**
  - `site/favicon.svg` (304 bytes)
- **Profile Avatar:**
  - Remote LinkedIn CDN (signed URL) -> to be migrated to local asset `public/assets/avatar.jpg` (34,310 bytes).
- **Projects Media (19 files):**
  - `automated-measuring-equipment/`: `ame.glb` (781,204 bytes) — 3D model, thumbnail: empty
  - `cursr-iv/`: `FC.glb` (1,880,488 bytes) — 3D model, thumbnail: empty
  - `ematch-ignition-module/`:
    - `ignition_module.glb` (1,046,996 bytes) — 3D model
    - `jlcpcb_assembled_pcb.jpg` (108,959 bytes) — thumbnail
    - `dummy_load_test.jpg` (77,561 bytes)
    - `oscilloscope_test.jpg` (122,335 bytes)
    - `weirdly_hot_mosfet.jpg` (30,665 bytes)
  - `engineering-internship/`:
    - `debugging.jpg` (569,465 bytes) — thumbnail
    - `CAD.png` (345,346 bytes)
    - `electrolysis.jpg` (190,732 bytes)
  - `fpga-video-player/`:
    - `bad-apple.png` (883,628 bytes) — thumbnail
    - YouTube embed: `https://www.youtube.com/embed/p0MyfT0LiCs`
  - `sph-simulator/`:
    - `sph.gif` (5,642,260 bytes ~ 5.38 MiB) — thumbnail & in-body animation (optimize thumbnail to static poster in Step 11)
  - `thamroi/`:
    - `homepage.png` (3,217,928 bytes) — thumbnail
    - `admin-dashboard.gif` (390,486 bytes)
    - `postmanapi.png` (119,298 bytes)
  - `weather-station/`:
    - `setup.jpg` (345,545 bytes) — thumbnail
    - `rain-gauge.jpg` (215,208 bytes)
  - `xsrt-rocket-test-bench/`:
    - thumbnail: empty (uses placeholder)
- **Websites Media (2 files):**
  - `ACC26FlightDataVisualization/`: `ACC26FlightDataVisualization.png` (325,668 bytes) — thumbnail
  - `BandResistorColorCodeCalculator/`: `BandResistorColorCodeCalculator.png` (62,440 bytes) — thumbnail

---

## 5. Collection Semantics & Logic Specification
1. **Search:**
   - Case-insensitive substring matching against: `meta.title`, `meta.summary`, `meta.organization`, `meta.role`, and every item in `meta.tags`.
2. **Sort Modes:**
   - `newest`: Date descending; for equal dates, preserve original manifest order (stable sort).
   - `oldest`: Date ascending; for equal dates, preserve original manifest order.
   - `az`: Title alphabetical ascending (`localeCompare`).
   - `za`: Title alphabetical descending (`localeCompare`).
3. **Tag Filtering:**
   - Multiple active tags use **OR** semantics (item displayed if it contains at least one of the selected tags).
   - If no tags are selected, all items matching search are displayed.
   - Tag filter button list sorted alphabetically.
   - Tag buttons use `aria-pressed` for accessibility.
4. **Skills on About/Landing Page:**
   - Aggregate all tags across projects.
   - Ordered by descending project count, then ascending alphabetically.
   - Header displays "Used across X projects".
5. **Website Status Badges:**
   - Statuses: `live` (green pill), `wip` (yellow pill), `archived` (gray pill + grayscale/dimmed thumbnail).
   - External links open in new tab (`target="_blank"`, `rel="noopener noreferrer"`), with `↗` marker.
6. **Error & Fallback Handling:**
   - Empty thumbnail or broken image renders a dedicated thumbnail placeholder ("No image" or SVG placeholder).
   - Build-time content failures must fail the build.
   - Explicit error message state that is not cleared by empty results.

---

## 6. Layout & Theme Specifications
1. **Layouts:**
   - `AppLayout`: Sidebar (220px sticky desktop, responsive header on mobile <= 720px) + Main content (`wrap` max-width 760px).
   - Project detail layout: Back link (`← Back to Portfolio`), header (`project-title`, meta info, tag list), hero figure/caption, article body.
2. **Theme:**
   - Initial script in `<head>` applies `data-theme="dark"|"light"` before paint from `localStorage.getItem('theme')` or system preference `(prefers-color-scheme: dark)`.
   - Theme toggle button with emoji/icon and accessible label (`aria-label`, `tt-icon`, `tt-label`).
   - Changes listen to system color scheme if no user preference stored in `localStorage`.
   - Consistent across all pages including ThamRoi.

---

## 7. Migration Step Verification Log
- [x] **Step 1:** Branch `feat/react-portfolio-port` created; baseline recorded; working tree clean and baseline site untouched.
- [x] **Step 2:** Toolchain added (package.json, Vite, React, ESLint, Vitest, scripts, clean npm ci, tests, and initial React build pass).
- [ ] **Step 3:** Static rendering and URL compatibility proved.
- [ ] **Step 4:** Canonical content and pure selectors established.
- [ ] **Step 5:** Layouts, navigation, and theme handling ported.
- [ ] **Step 6:** About and Profile ported.
- [ ] **Step 7:** Collections ported and error handling fixed.
- [ ] **Step 8:** Project article structure and all narratives ported.
- [ ] **Step 9:** Interactive media integrated (3D models, lazy loading, YouTube).
- [ ] **Step 10:** CV and resume artifacts integrated.
- [ ] **Step 11:** Styles consolidated, accessibility and media performance improved.
- [ ] **Step 12:** Deployment updated and legacy frontend retired.
- [ ] **Step 13:** Regression checks and handoff recorded.

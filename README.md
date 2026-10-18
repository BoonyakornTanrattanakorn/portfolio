# Boonyakorn Tanrattanakorn — Portfolio

Modern, high-performance engineering portfolio built with **React 19** and **Vite**, prerendered to static HTML at build time for optimal performance, instant loading, and SEO. Includes interactive 3D model viewers (`@google/model-viewer`), responsive media embeds, accessible dark/light theme support, and an integrated CV viewer generated via [RenderCV](https://github.com/rendercv/rendercv).

**Live Site:** [boonyakorntanrattanakorn.github.io/portfolio](https://boonyakorntanrattanakorn.github.io/portfolio/)

---

## Architecture & Project Structure

The project uses build-time static prerendering (SSG): every page is rendered to complete, accessible HTML with no hydration waterfalls, while React provides dynamic client-side filtering, sorting, theme toggling, and lazy-loaded 3D media viewers.

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages build, test, and deploy workflow
├── CV/
│   ├── CV.yaml                 # RenderCV source definition
│   ├── Boonyakorn_Tanrattanakorn_CV.html   # Committed HTML resume
│   └── Boonyakorn_Tanrattanakorn_CV.pdf    # Committed PDF resume
├── resume/                     # Additional tailored resume variants
├── scripts/
│   ├── build.js                # Production Vite + SSR prerendering script
│   ├── preview.js              # Faithful local static HTTP preview server
│   ├── validate-content.js     # Metadata and schema validation script
│   └── verify-artifacts.js     # Production artifact verification script
├── site/
│   ├── assets/
│   │   ├── avatar.jpg          # Profile avatar photo
│   │   └── css/styles.css      # Core tokens, layout, and utility CSS
│   ├── content/                # Single canonical source of truth for portfolio data
│   │   ├── projects.json       # Ordered project slugs manifest
│   │   ├── websites.json       # Ordered website IDs manifest
│   │   ├── projects/           # Case study metadata (meta.json) and JSX narratives (Body.jsx)
│   │   └── websites/           # External website listings metadata (meta.json)
│   ├── favicon.svg             # Site icon
│   ├── projects/               # Project media assets (images, GLB models, videos)
│   ├── src/                    # React components, pages, context, and selectors
│   └── websites/               # Website screenshot assets
└── tests/                      # Automated Vitest test suite (94+ tests)
```

---

## Development Commands

Requires **Node.js >= 20.0.0** and **npm >= 10.0.0**.

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server with HMR. |
| `npm run build` | Builds client assets and prerenders all 15 static HTML pages into `dist/` (defaults to base `/portfolio/`). |
| `npm run preview` | Serves `dist/` locally over HTTP without SPA fallback (matches production GitHub Pages behavior). |
| `npm test` | Runs the automated Vitest test suite. |
| `npm run lint` | Runs ESLint across all JavaScript, JSX, and configuration files. |
| `npm run validate:content` | Validates canonical JSON schemas, required fields, and referenced media existence. |
| `npm run verify:artifacts` | Inspects `dist/` to verify all required pages, compatibility endpoints, and CV copies are present and uncorrupted. |
| `npm run check` | Runs linting, tests, and content validation in sequence. |

---

## URL & Base Path Configuration

The build system cleanly supports both subpath deployments (e.g. GitHub Pages at `/portfolio/`) and root deployments (`/`):

- **Default (GitHub Pages):** `npm run build` defaults to `--base /portfolio/`.
- **Root deployment (custom domain or local preview):**
  ```bash
  BASE_PATH=/ npm run build
  npm run preview -- --base /
  ```
- **CLI parameter override:**
  ```bash
  node scripts/build.js --base /my-subpath/
  ```

All asset references, navigation links, and internal routes automatically adapt via the `withBase()` utility.

---

## Content Management

### Adding a Project

1. **Place media files:** Create `site/projects/<slug>/` and add any diagrams, screenshots, or 3D models (`.glb`).
2. **Define metadata:** Create `site/content/projects/<slug>/meta.json`:
   ```json
   {
     "title": "Project Title",
     "role": "Role / Specialization",
     "date": "2025",
     "organization": "Company or University",
     "tags": ["Embedded", "C++", "STM32"],
     "thumbnail": "thumbnail.jpg",
     "summary": "Short 1-2 sentence description of the project."
   }
   ```
3. **Write case study narrative:** Create `site/content/projects/<slug>/Body.jsx` exporting the case study content as a React component.
4. **Register slug:** Add `"<slug>"` to `site/content/projects.json` in the desired display order.
5. **Verify:** Run `npm run validate:content` and `npm test`.

### Adding an External Website Listing

1. **Place screenshot:** Create `site/websites/<id>/` and add a screenshot image.
2. **Define metadata:** Create `site/content/websites/<id>/meta.json`:
   ```json
   {
     "title": "Website Name",
     "url": "https://example.com",
     "role": "Full-Stack Developer",
     "date": "2025",
     "organization": "Personal Project",
     "status": "live",
     "tags": ["React", "TypeScript", "Tailwind CSS"],
     "thumbnail": "screenshot.png",
     "summary": "Summary of the web application."
   }
   ```
3. **Register ID:** Add `"<id>"` to `site/content/websites.json`.
4. **Verify:** Run `npm run validate:content`.

---

## CV & Resume Workflow

The canonical CV source is defined in [`CV/CV.yaml`](CV/CV.yaml).

### Regenerating the CV Locally

CV rendering requires Python 3.10+ and RenderCV:

```bash
# Set up Python virtual environment
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install RenderCV with full font and typeset support
pip install "rendercv[full]==2.6.*"

# Render HTML and PDF artifacts into CV/
rendercv render CV/CV.yaml
```

The rendered `Boonyakorn_Tanrattanakorn_CV.html` and `Boonyakorn_Tanrattanakorn_CV.pdf` files are committed to `CV/`.

> **Note on CI/Deployment:** GitHub Actions does **not** install Python or execute RenderCV during CI. The deployment workflow copies and verifies the committed CV artifacts from `CV/` directly into the published production bundle.

---

## Deployment & CI Workflow

Continuous integration and deployment are managed via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **`validate` job:** Runs on all pull requests and pushes to `main`.
   - Performs clean dependency installation (`npm ci`).
   - Runs linting (`npm run lint`), unit tests (`npm test`), and schema validation (`npm run validate:content`).
   - Executes production build (`npm run build`) and verifies all output files and CV artifacts (`npm run verify:artifacts`).
2. **`deploy` job:** Runs strictly on pushes to `main` (or manual `workflow_dispatch`) after the `validate` job succeeds.
   - Uploads only the validated static `dist/` directory as a GitHub Pages artifact.
   - Strictly keeps temporary build artifacts, source code, and node modules outside the published bundle.

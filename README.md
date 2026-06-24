# Boonyakorn Tanrattanakorn — Portfolio

A static portfolio website plus a CV. The site is hand-written HTML/CSS/JS with a
JSON-driven project gallery, and the CV is written in YAML and rendered to PDF/HTML
using [RenderCV](https://github.com/rendercv/rendercv).

**Live site:** [boonyakorntanrattanakorn.github.io/portfolio](https://boonyakorntanrattanakorn.github.io/portfolio/)

---

## Site structure

The site is a set of static pages sharing a stylesheet, sidebar, and theme script.

| File | Purpose |
|------|---------|
| `index.html` | Landing / about page; aggregates skills from project tags |
| `profile.html` | Short profile / contact page |
| `projects.html` | Project gallery (data-driven from `portfolio/`) |
| `cv.html` | CV viewer (embeds the rendered CV) |
| `sidebar.html` | Shared sidebar component, fetched into each page |
| `theme.js` | Loads the sidebar and handles the dark-mode toggle |
| `favicon.svg` | Site icon |
| `portfolio/` | Project data, styles, and per-project pages (see below) |
| `CV/` | CV source (`CV.yaml`) and rendered outputs (HTML/PDF) |

### Portfolio data (`portfolio/`)

The project gallery is driven by data, not hard-coded markup:

| File | Purpose |
|------|---------|
| `portfolio/styles.css` | Shared stylesheet for all pages |
| `portfolio/projects.json` | Ordered list of project slugs to display |
| `portfolio/meta-loader.js` | Populates a project page from its `meta.json` |
| `portfolio/projects/<slug>/` | One folder per project |

Each project folder contains:

- `index.html` — the project's detail page
- `meta.json` — project metadata (title, summary, tags, etc.)
- any images/assets (`.png`, `.gif`, `.glb`, …)

`meta.json` schema:

```json
{
  "title": "Project Title",
  "role": "Your role on the project",
  "date": "2024",
  "organization": "Org or context",
  "tags": ["tag1", "tag2"],
  "thumbnail": "image.png",
  "summary": "Short one-line summary."
}
```

`index.html`, `profile.html`, and `projects.html` read these tags to build the
"Skills & Tools" view and the gallery, so keeping tags consistent keeps the site
consistent.

### Adding a project

1. Create `portfolio/projects/<your-slug>/`.
2. Add an `index.html` (project detail page) and a `meta.json` (schema above).
3. Add the `<your-slug>` string to `portfolio/projects.json` in the position you
   want it to appear.

---

## Editing the CV

The CV lives in [`CV/CV.yaml`](CV/CV.yaml) with three top-level keys:

| Key | Purpose |
|-----|---------|
| `cv` | Personal info, sections, and all content entries |
| `design` | Theme and visual settings (font, colors, spacing, etc.) |
| `locale` | Language and date format strings |

See the [RenderCV documentation](https://docs.rendercv.com) for the full schema and
entry types (`ExperienceEntry`, `EducationEntry`, `PublicationEntry`, `BulletEntry`, …).

### Rendering the CV locally

Requires Python 3.10+.

```bash
# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install RenderCV with all optional dependencies (Typst, fonts, etc.)
pip install "rendercv[full]"

# Render — outputs are written next to the source in CV/
rendercv render CV/CV.yaml
```

The rendered `*.html` and `*.pdf` are committed under `CV/` and copied into the
deploy as `Boonyakorn_Tanrattanakorn_CV.html` / `.pdf`.

---

## Local preview

Serve the repo root over HTTP so relative fetches (sidebar, `meta.json`, etc.) resolve:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

---

## GitHub Pages deployment

Pushing changes under the watched paths to `main` triggers the workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which assembles a
`_site/` directory from the static pages and committed CV outputs and deploys it to
GitHub Pages.

> Note: the workflow does **not** run RenderCV. It deploys the CV HTML/PDF already
> committed under `CV/`, so re-render and commit those files when the CV changes.

```
Static pages + portfolio/ + committed CV/ outputs
    │
    ▼
git push to main   (paths: CV/**, portfolio/**, *.html, theme.js, …)
    │
    ▼
.github/workflows/deploy.yml
    │
    ▼
_site/
  ├── index.html            ← landing / about
  ├── profile.html          ← profile / contact
  ├── projects.html         ← project gallery
  ├── cv.html               ← CV viewer
  ├── sidebar.html          ← shared sidebar component
  ├── theme.js              ← sidebar loader + dark-mode toggle
  ├── favicon.svg
  ├── portfolio/            ← styles, projects.json, meta-loader.js, projects/
  └── CV/
      ├── Boonyakorn_Tanrattanakorn_CV.html
      └── Boonyakorn_Tanrattanakorn_CV.pdf
    │
    ▼
actions/deploy-pages  →  GitHub Pages
```

### Enabling GitHub Pages (first time)

1. Repository → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any change to `main` to trigger the first deployment

The workflow also supports manual runs via **Actions → Render CV and Deploy to
GitHub Pages → Run workflow**.

---

## Credits

The CV is generated with **[RenderCV](https://github.com/rendercv/rendercv)** — an
open-source tool that renders a YAML-defined CV into typeset PDF and HTML.

- Repository: https://github.com/rendercv/rendercv
- Documentation: https://docs.rendercv.com
- License: MIT

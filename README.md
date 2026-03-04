# Boonyakorn Tanrattanakorn — CV

My personal CV written in YAML and rendered to PDF/HTML using [RenderCV](https://github.com/rendercv/rendercv).

**Live CV:** [https://boonyakorntanrattanakorn.github.io/CV/](https://boonyakorntanrattanakorn.github.io/CV/)

---

## Usage

### Prerequisites

- Python 3.10+

### Setup

```bash
# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install RenderCV with all optional dependencies (Typst, fonts, etc.)
pip install "rendercv[full]"
```

### Render locally

```bash
rendercv render Boonyakorn_Tanrattanakorn_CV.yaml
```

Output files are written to `rendercv_output/`:

| File | Description |
|------|-------------|
| `*.pdf` | Print-ready PDF |
| `*.html` | Standalone HTML (used for GitHub Pages) |
| `*.typ` | Typst source |
| `*.md` | Markdown version |
| `*.png` | Page preview image(s) |

---

## Editing the CV

All content lives in [`Boonyakorn_Tanrattanakorn_CV.yaml`](Boonyakorn_Tanrattanakorn_CV.yaml).

The file has three top-level keys:

| Key | Purpose |
|-----|---------|
| `cv` | Personal info, sections, and all content entries |
| `design` | Theme and visual settings (font, colors, spacing, etc.) |
| `locale` | Language and date format strings |

Refer to the [RenderCV documentation](https://docs.rendercv.com) for the full schema reference and available entry types (`ExperienceEntry`, `EducationEntry`, `PublicationEntry`, `BulletEntry`, etc.).

---

## GitHub Pages Deployment

Pushing to `main` automatically renders the CV and deploys it via the workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### How it works

```
push to main
    │
    ▼
actions/checkout
    │
    ▼
pip install "rendercv[full]"
    │
    ▼
rendercv render *.yaml  →  rendercv_output/
    │
    ▼
_site/
  ├── index.html          ← CV page (renamed from rendercv_output/*.html)
  ├── Boonyakorn_Tanrattanakorn_CV.pdf
  └── *.png               ← preview images
    │
    ▼
actions/deploy-pages  →  GitHub Pages
```

### Enabling GitHub Pages (first time)

1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any change to `main` to trigger the first deployment

The workflow also supports manual runs via **Actions → Render CV and Deploy to GitHub Pages → Run workflow**.

---

## Credits

This CV is generated with **[RenderCV](https://github.com/rendercv/rendercv)** — an open-source tool that renders a YAML-defined CV into professionally typeset PDF and HTML outputs.

- Repository: https://github.com/rendercv/rendercv
- Documentation: https://docs.rendercv.com
- License: MIT

# Boonyakorn Tanrattanakorn — Portfolio

My personal CV written in YAML and rendered to PDF/HTML using [RenderCV](https://github.com/rendercv/rendercv).

**Live Portfolio:** [boonyakorntanrattanakorn.github.io/portfolio](https://boonyakorntanrattanakorn.github.io/portfolio/)

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
rendercv render CV.yaml
```

Output files are written to `CV/`:

| File | Description |
|------|-------------|
| `*.pdf` | Print-ready PDF |
| `*.html` | Standalone HTML (used for GitHub Pages) |

---

## Editing the CV

All content lives in [`CV.yaml`](CV.yaml).

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
Edit CV.yaml
    │
    ▼
rendercv render CV.yaml  (run locally)
    │
    ▼
CV/
  ├── Boonyakorn_Tanrattanakorn_CV.html
  └── Boonyakorn_Tanrattanakorn_CV.pdf
    │
    ▼
git push to main
    │
    ▼
actions/checkout
    │
    ▼
_site/
  ├── index.html                        ← sidebar navigation
  └── CV/
      ├── Boonyakorn_Tanrattanakorn_CV.html
      └── Boonyakorn_Tanrattanakorn_CV.pdf
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

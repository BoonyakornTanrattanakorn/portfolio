# Portfolio — project data

This folder holds the data and assets for the project gallery. The gallery page
itself is [`../projects.html`](../projects.html) at the repo root; it fetches the
files here at runtime to build the cards, search, sort, and tag filters.

## Contents

- `projects.json` — ordered list of project slugs to display, e.g.
  `["cursr-iv", "fpga-video-player", ...]`. Order controls default display order.
- `styles.css` — shared stylesheet for every page on the site.
- `meta-loader.js` — included by each project's `index.html`; reads that project's
  `meta.json` and fills in the page title, meta line, tags, and thumbnail.
- `projects/<slug>/` — one folder per project.

## Project folder structure

Each project lives under `projects/<slug>/` and typically contains:

- `index.html` — the project's detail page (includes `../../meta-loader.js`).
- `meta.json` — project metadata used by both the gallery and the detail page.
- image/asset files (`.png`, `.gif`, `.jpg`, `.glb`, …).

### `meta.json` schema

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

Notes:
- `thumbnail` is a filename **relative to the project folder** (or empty for none —
  a "No image" placeholder is shown).
- `tags` feed both the gallery's tag filters and the home page's "Skills & Tools"
  aggregate, so keep them consistent across projects.
- `date` may be a full date or just a year; it is used for newest/oldest sorting.

## Adding a new project

1. Create `projects/<your-slug>/`.
2. Add an `index.html` (project content) and a `meta.json` (schema above).
3. Add `"<your-slug>"` to `projects.json` in the position you want it to appear.

## Local preview

Serve the **repo root** over HTTP so relative fetches resolve, then open the site:

```bash
python -m http.server 8000
# then open http://localhost:8000/projects.html
```

Opening the HTML files directly via `file://` will break the `fetch()` calls for
the sidebar and `meta.json`.

## Misc — GLB model compression

Optimizing `.glb` models (e.g. `projects/cursr-iv/FC.glb`) can cut file size by
~90%:

```cmd
npx @gltf-transform/cli optimize in.glb out.glb
```

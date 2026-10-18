# Portfolio — Project Assets & Structure

This folder holds the binary and media assets (images, animations, and 3D `.glb` models) for each engineering project case study.

## Project Media Folders

Each project has a dedicated folder under `site/projects/<slug>/`:

- `site/projects/<slug>/` — image, video, and model assets (`.png`, `.jpg`, `.gif`, `.glb`).

## Canonical Content Architecture

Project data and narrative text have been modernized to React and centralized in `site/content/`:

1. **Manifest:** `site/content/projects.json` defines the ordered list of project slugs.
2. **Metadata:** `site/content/projects/<slug>/meta.json` contains title, role, date, organization, tags, thumbnail filename, and summary.
3. **Narrative Case Study:** `site/content/projects/<slug>/Body.jsx` provides the structured React narrative component (diagrams, tables, code listings, lazy 3D viewers).

### Adding a New Project

1. Add media files to `site/projects/<slug>/`.
2. Create `site/content/projects/<slug>/meta.json` with the required metadata fields.
3. Create `site/content/projects/<slug>/Body.jsx` exporting the project's case study content.
4. Add `"<slug>"` to `site/content/projects.json` at the desired position.
5. Validate content: `npm run validate:content`.

### GLB 3D Model Optimization

For 3D models (rendered via the lazy `<ModelViewer>` component), optimize `.glb` files before committing:

```bash
npx @gltf-transform/cli optimize in.glb out.glb
```

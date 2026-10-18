# Websites Collection — Assets & Structure

This directory holds the screenshot images for external website listings.

## Directory Structure

Each website has a dedicated folder under `site/websites/<id>/`:

- `site/websites/<id>/` — screenshot image (e.g., `screenshot.png`).

## Canonical Content Architecture

Website metadata is managed in `site/content/`:

1. **Manifest:** `site/content/websites.json` defines the ordered array of website IDs.
2. **Metadata:** `site/content/websites/<id>/meta.json` specifies the URL, title, role, date, status (`live`, `wip`, `archived`), tags, thumbnail, and summary.

### Adding a New Website

1. Place the screenshot in `site/websites/<id>/`.
2. Create `site/content/websites/<id>/meta.json`:

```json
{
  "title": "Project Name",
  "url": "https://example.com",
  "role": "Full-Stack Developer",
  "date": "2025",
  "organization": "Personal Project",
  "status": "live",
  "tags": ["React", "TypeScript", "Tailwind CSS"],
  "thumbnail": "screenshot.png",
  "summary": "Short description of the web application."
}
```

3. Add `"<id>"` to `site/content/websites.json`.
4. Validate content: `npm run validate:content`.
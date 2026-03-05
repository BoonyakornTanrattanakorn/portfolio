
# Portfolio — Documentation

This folder contains the source and metadata for the project portfolio shown on the site. It includes an index page that lists projects and a `projects/` directory with each project's files and metadata.

Contents
- `portfolio.html` — The portfolio index page used on the site.
- `projects.json` — A generated/compiled manifest of projects (if used by your build or site).
- `projects/` — Subfolders for each project. Each project folder typically contains an `index.html` and a `meta.json` file describing the project.

Project folder structure

Each project lives under `projects/<project-slug>/`. A typical project folder contains:
- `index.html` — The project's detailed page or demo.
- `meta.json` — Project metadata used to populate the portfolio index.

Recommended `meta.json` schema (example)

{
	"title": "Project Title",
	"summary": "Short one-line summary",
	"date": "YYYY-MM-DD",
	"tags": ["tag1","tag2"],
	"repo": "https://github.com/username/repo",
	"live": "relative/or/absolute/url"
}

How to add a new project
1. Create a new folder `projects/<your-slug>/`.
2. Add an `index.html` with your project content or demo.
3. Add a `meta.json` using the schema above.
4. Optionally update `projects.json` or run whatever build step your site uses to regenerate the index.

Local preview
- Open `portfolio/portfolio.html` in a browser to preview the portfolio page.
- For a more accurate preview (relative links, fetches), serve the folder over a local HTTP server, e.g.:

	python -m http.server 8000

 then open `http://localhost:8000/portfolio/portfolio.html`.

Deployment notes
- The portfolio files are static; deploy the `portfolio/` contents to your web host or include them in your site's build/publishing pipeline.
- Ensure any absolute or root-relative links are adjusted to match your deployment path.

Contributing
- Keep `meta.json` concise and consistent across projects.
- Use descriptive tags and a clear summary to improve discoverability.

# Misc
Model Compression
- This can reduce filesize by 90%
```cmd
 npx @gltf-transform/cli optimize in.glb out.glb
```
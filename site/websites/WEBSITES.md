# Websites collection

Each website is a folder containing `meta.json` and a screenshot. Unlike
projects, websites have no `index.html` — the card links straight to the live
site.

## Adding a website

1. Create `site/websites/<id>/`.
2. Add `meta.json` (schema below) and a screenshot image.
3. Append `"<id>"` to the array in `websites.json`.

That's it — the page is data-driven and the deploy workflow copies all of
`site/`, so no build or CI change is needed.

## meta.json

```json
{
  "title": "ThamRoi",
  "url": "https://thamroi.example.com",
  "role": "Full-Stack Developer",
  "date": "2025",
  "organization": "Personal Project",
  "status": "live",
  "tags": ["Next.js", "PostgreSQL"],
  "thumbnail": "screenshot.png",
  "summary": "One or two sentences describing the site."
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Falls back to the folder id if missing. |
| `url` | yes | Where the card links. Without it the card links nowhere. |
| `summary` | recommended | Card body text; also searched. |
| `tags` | recommended | Drive the tag filter buttons; also searched. |
| `date` | recommended | Used by Newest/Oldest sort. A bare year works. |
| `thumbnail` | optional | Filename inside the folder. Missing or broken images fall back to a "No image" placeholder. |
| `status` | optional | `live`, `wip`, or `archived`. Renders a pill; `archived` also greys the screenshot. |
| `role`, `organization` | optional | Shown in the card meta line; also searched. |

## Shared engine

Both this page and the portfolio page are driven by
[`../assets/js/collection.js`](../assets/js/collection.js), which handles card
rendering, search, sorting, and tag filtering. `websites.html` passes
`external: true` so cards open in a new tab.

# Prompt for generating meta.json

````markdown
You are looking at the source of a website I built. I want to add it to my
portfolio site, which renders a grid of website cards from static JSON. Inspect
this repository and generate the files described below.

## What to produce

Output exactly two things, as separate labelled code blocks. Do not create,
modify, or delete any file in this repository — just print them.

### 1. The folder id

A short kebab-case slug identifying this website (e.g. `thamroi`,
`shop-dashboard`). Lowercase letters, digits, and hyphens only. Derive it from
the project or product name, not the git remote. Print it on its own line.

### 2. `meta.json`

```json
{
  "title": "ThamRoi",
  "url": "https://thamroi.example.com",
  "role": "Full-Stack Developer",
  "date": "2025",
  "organization": "Personal Project",
  "status": "live",
  "tags": ["Next.js", "TypeScript", "PostgreSQL"],
  "thumbnail": "screenshot.png",
  "summary": "Matchmaking web app with group search, profiles, and admin moderation."
}
```

| Field | Required | How to fill it |
| --- | --- | --- |
| `title` | yes | Human-readable product name. Not the repo slug — "ThamRoi", not "thamroi-web". |
| `url` | yes | The **live deployed URL**, not the repo URL. Check README, `vercel.json`, `netlify.toml`, CNAME, deploy workflows, or package homepage. If you cannot find one, use the literal string `TODO://set-live-url` so it's obviously unfinished. |
| `summary` | yes | One or two sentences, max ~160 chars, describing what the site *does* for a user. Plain language, no marketing voice, no trailing tech list — the tags already cover that. |
| `tags` | yes | 3–7 entries. Real user-facing stack only. See the vocabulary rules below. |
| `date` | yes | Year the site launched or was last substantially worked on, as a string: `"2025"`. Infer from git history if unclear. |
| `status` | yes | `live` if currently deployed and reachable; `wip` if unfinished or not yet deployed; `archived` if it's been taken down or superseded. |
| `role` | optional | My role, e.g. `Full-Stack Developer`, `Frontend Developer`. Omit the field if you genuinely can't tell. |
| `organization` | optional | `Personal Project`, `Academic Project`, `Freelance`, or a client/company name. Omit if unclear. |
| `thumbnail` | optional | Always use `"screenshot.png"` — I'll add the actual image by hand. |

## Tag vocabulary

Prefer these exact spellings where they apply, so filter buttons on my
portfolio merge instead of fragmenting:

`TypeScript`, `JavaScript`, `Next.js`, `React`, `Vue`, `Svelte`,
`Tailwind CSS`, `Node.js`, `PostgreSQL`, `MySQL`, `MongoDB`, `Prisma`,
`Supabase`, `Firebase`, `Docker`, `Python`, `Django`, `FastAPI`, `Full-Stack`

Rules:
- Only tag what a maintainer would name as a defining choice. Read
  `package.json` / `requirements.txt` / lockfiles to confirm.
- Skip transitive dependencies, dev tooling (ESLint, Prettier, Vite), and
  testing libraries.
- If the stack includes something not listed above, use the technology's own
  canonical capitalisation (e.g. `Astro`, `Go`, `Redis`).

## Rules

- Valid JSON only: double quotes, no trailing commas, no comments.
- Omit optional fields entirely rather than emitting `""`, `null`, or a guess.
- **Do not invent a URL.** A wrong link is worse than a `TODO://` marker.
- Do not add fields beyond those in the table — unknown keys are ignored.

## Also report

After the two blocks, list in plain prose:
- anything you had to guess or could not determine, and
- the file or commit you got the live URL from.
````
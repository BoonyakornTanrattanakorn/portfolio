# React port implementation plan for Gemini

Implement this plan in the current portfolio repository. Read the applicable repository instructions before making changes. Preserve the portfolio's content, visual identity, public page URLs, and GitHub Pages hosting while converting the application to React using JavaScript and JSX.

**create new branch. do it step by step. commit each step to git. do not coauthor.**

## Execution rules

- Work through the numbered steps in order. Complete each step's verification and commit it before starting the next step.
- Use the existing Git author configuration. Do not add `Co-authored-by` trailers, AI attribution, or assistant signatures to commits. Do not change the user's Git identity.
- Inspect the working tree first. Preserve unrelated work, stage explicit file paths, and review each staged diff before committing. Do not use a blanket `git add .` to collect unrelated changes.
- Keep commits limited to the step being implemented. If verification fails, fix the failure before committing. Report any verification that cannot be performed accurately.
- Use JavaScript/JSX for the application. Keep dependencies proportionate to this small, static portfolio. Use component state for collection controls and shared context for theme state.
- Port the existing design and behavior first. Include the specified code-quality, accessibility, and media improvements without rewriting the project narratives.
- Keep the existing static site available as the reference until its React replacement passes the final migration checks. Do not copy unfinished React source into the published artifact.
- Update this plan's progress checklist in each step's commit. Narrowly allow any additional Markdown documentation in `.gitignore`, which currently ignores Markdown except explicitly allowed files.

## Baseline and target

The current deployable site is `site/`. It has five main pages, nine project detail pages, two external website listings, three GLB model viewers, and a YouTube embed. Application behavior currently lives in `site/assets/js/theme.js`, `collection.js`, `meta-loader.js`, and inline page scripts. Shared styles live in `site/assets/css/styles.css`.

`CV/` and `resume/` contain RenderCV YAML sources and generated documents. The deployment workflow currently copies committed CV artifacts; it does not run RenderCV. The two linked website applications are hosted elsewhere and their application source is not part of this migration.

Use React + Vite with a small build-time rendering pipeline. A shared page manifest must drive HTML generation and select the corresponding React page for hydration. Generate physical HTML files at the existing paths, and use standard links between pages. All pages must render their content and metadata in the initial HTML. Hydrate the same component tree and initial props in the browser.

Suggested final organization:

```text
package.json
package-lock.json
vite.config.js
scripts/                         # Build, content validation, static preview
site/
  src/
    entry-client.jsx
    entry-server.jsx
    pages.js                     # Shared page definitions and output paths
    pages/                       # Main page components
    components/                  # Layouts, navigation, reusable media
    features/collections/        # Cards, controls, pure selectors
    theme/                       # Initializer, provider, toggle
    styles/                      # Tokens, reset, component-scoped styles
  content/
    projects/<slug>/             # Canonical metadata and project body JSX
    websites/<id>/               # Canonical website metadata
    projects.json
    websites.json
    profile.js                   # Shared portfolio identity/contact data
  public/                        # Media and favicon at compatible public paths
CV/                              # Existing RenderCV sources and artifacts
resume/                          # Existing tailored resume sources/artifacts
dist/                            # Generated deployment artifact; Git-ignored
```

Treat this structure as a guide; choose clear names without introducing parallel sources of truth. Keep Node-only validation and rendering code out of browser bundles. Preserve the existing case of website IDs and media filenames for Linux hosting.

## Step 1 — Create a branch and record the baseline

1. Run `git status --short`, inspect the current branch, and read repository instructions.
2. Create and switch to a new branch, for example `feat/react-portfolio-port`. If that name already exists, choose a unique new name.
3. Record the existing routes, metadata counts, referenced media, screenshot baselines where available, and expected behaviors in a migration checklist. The plan document and its `.gitignore` exception may already be uncommitted preparation artifacts; include those task artifacts in this baseline commit while preserving unrelated changes.
4. Record these required page paths beneath the deployment base:
   - `/` and `/index.html`.
   - `/profile.html`, `/projects.html`, `/websites.html`, `/cv.html`.
   - `/projects/<slug>/index.html` for all nine slugs in `site/projects/projects.json`, including the equivalent directory URLs.
   - Existing project media paths and `/CV/Boonyakorn_Tanrattanakorn_CV.html` and `.pdf`.
5. Record collection semantics: case-insensitive search across title, summary, organization, role, and tags; four sort modes; OR matching between selected tags; stable ordering for equal dates; skill tags ordered by usage count and then alphabetically; external website status badges.

**Verify:** The branch is new, the checklist matches the repository, and the baseline site is unchanged.

**Commit:** `docs: record React migration baseline`

## Step 2 — Add the JavaScript toolchain

1. Add root npm configuration, React, React DOM, Vite, and the React Vite plugin. Select compatible maintained versions and commit the lockfile.
2. Pin a supported Node version for local development and CI. Add ESLint with React Hooks and JSX accessibility checks, plus focused unit-test tooling.
3. Add documented commands for development, linting, tests, content validation, production builds, and preview. Keep commands usable on Windows and Linux.
4. Add a minimal React entry and page. Keep the current production deployment workflow unchanged at this stage.
5. Ignore `node_modules`, generated builds, test reports, and caches without removing existing RenderCV ignore rules or tracked PDF artifacts.

**Verify:** A clean `npm ci` succeeds; the initial React page runs; linting, the initial build, and any added tests pass. Do not create tests that only assert static boilerplate.

**Commit:** `build: add React and Vite toolchain`

## Step 3 — Prove static rendering and URL compatibility

1. Implement the shared page manifest, build-time React renderer, and matching browser hydration entry. Use the APIs supported by the installed React version, such as static prerendering or `renderToString` paired with `hydrateRoot`.
2. Generate initial HTML through the rendering pipeline, with a title, description, canonical URL, favicon, social metadata, and the correct built asset references.
3. Centralize the deployment base. Use `/portfolio/` for the existing GitHub Pages deployment and support `/` for local/root-hosted validation. Generate page, media, and document links through consistent helpers.
4. Add a small static preview server or equivalent configuration that faithfully serves the build beneath either base. It must not hide missing files by returning the homepage for every request.
5. Prove both a main `.html` page and a nested project `index.html` using temporary page components. Produce a proper static `404.html` for unknown paths.
6. Keep page selection, serialized initial props, and hydration deterministic. Escape serialized data correctly. Avoid accessing browser globals during build-time rendering.

**Verify:** Direct requests and refreshes work at both deployment bases; initial HTML contains real page content and metadata; scripts and styles load; hydration has no warnings; unknown paths receive the intended 404 behavior. Directory and explicit `index.html` URLs select the same project.

**Commit:** `feat: add static React page rendering`

## Step 4 — Establish canonical content and pure collection logic

1. Migrate manifests and all 11 metadata files into one canonical content location, preserving IDs, display text, and explicit manifest order.
2. Validate metadata during the build: unique IDs, required strings, tag arrays, supported website statuses, valid external HTTP(S) URLs, and existing thumbnail/media references. Allow intentionally empty thumbnails.
3. Normalize dates explicitly. Current dates are year strings; preserve their display and sort meaning without relying on permissive browser-specific date parsing. Keep manifest order as the tie-breaker for equal dates.
4. Extract pure functions for search, tag selection, sorting, and skill-frequency aggregation. Do not mutate source arrays or metadata objects.
5. Derive gallery cards, project headers, and skills from this same data. Generate compatibility JSON files at existing public manifest/metadata paths if retaining those endpoints.
6. Centralize portfolio identity, contact links, and avatar references without trying to merge intentionally tailored resume content into a universal profile model.

**Verify:** The actual content passes validation. Focused tests cover malformed metadata, duplicate IDs, missing referenced files, search fields/case, OR tag behavior, all sort modes, equal-date order, and skill-count ordering.

**Commit:** `refactor: centralize portfolio content and selectors`

## Step 5 — Port layouts, navigation, and theme handling

1. Replace fetched sidebar HTML with React components. Preserve the main-page layout and the project pages' article layout and back link.
2. Generate navigation from shared definitions, with an appropriate navigation landmark and `aria-current` on the active page.
3. Replace duplicated theme logic with one shared early initializer and a provider/toggle used consistently across pages, including ThamRoi.
4. Preserve the `theme` storage key and existing light/dark preferences. Guard storage failures. Follow system theme changes while the user has no saved choice, and remove event listeners on cleanup.
5. Preserve theme-before-paint behavior while ensuring build-time and initial browser markup agree. Do not introduce hydration mismatches through theme-dependent labels.

**Verify:** Main and project layouts match the baseline; saved themes survive page navigation and refresh; system preference changes work; blocked storage does not crash the page; navigation and theme controls work by keyboard.

**Commit:** `feat: port shared layouts navigation and theme`

## Step 6 — Port About and Profile

1. Convert `site/index.html` and `site/profile.html` to page components with their existing content and links.
2. Render skills from the validated project data at build time, preserving frequency ordering and the project count.
3. Render metadata and tags through JSX text expressions. Remove the old skills-fetching and `innerHTML` construction from the new implementation.
4. Replace repeated signed LinkedIn avatar URLs with a locally stored copy of the existing profile image, and update social-image references to stable absolute URLs. If the image cannot be retrieved, record the issue and use an intentional local fallback until the original can be supplied.

**Verify:** Both pages have complete initial HTML, correct metadata, working contact links, and consistent content in both themes. Skills require no manifest/metadata fetch waterfall.

**Commit:** `feat: port About and Profile pages`

## Step 7 — Port both collections and fix error handling

1. Build shared collection controls, cards, tag filters, result count, and empty-state components. Keep project and external-website link behavior explicit.
2. Preserve all baseline search/filter/sort behavior and website status badges. Include working thumbnail fallbacks.
3. Store only the control values as state; derive visible results through the pure selectors. Use immutable selected-tag updates. Add memoization or debouncing only where measurements justify it.
4. Replace DOM decoration callbacks with declarative props and components. Remove raw metadata interpolation into `innerHTML`.
5. Fix the existing failure mode: `collection.js` appends metadata errors and then immediately erases them during rendering. Build-time content failures must fail clearly. Any remaining runtime error must have its own visible state and must not become a misleading empty result.
6. Add `aria-pressed` to tag buttons and an appropriate live result announcement. Preserve useful focus when filters change.

**Verify:** Tests exercise controls together, external links/status badges, image failures, and the distinction between empty results and errors. Browser-check both collections with keyboard input and in both themes.

**Commit:** `feat: port collections and fix collection error states`

## Step 8 — Port project article structure and all narratives

1. Create a shared project layout, header, metadata list, tag list, thumbnail/placeholder, figure/caption, and article styling.
2. Convert all nine project narratives into readable JSX modules. Preserve paragraphs, headings, lists, equations, tables, code samples, captions, and cross-project links.
3. Resolve image paths through the shared asset helpers. Keep one canonical copy of each asset at its compatible public path.
4. Generate all nine detail pages from the manifest and validated metadata. Their titles, headers, tags, descriptions, and thumbnails must be present in the initial HTML.
5. Use JSX markup for narrative content and shared components for repeated structures. Avoid converting the articles into opaque HTML strings or a complex generic block-description language.

**Verify:** All nine pages build and load directly; compare their text and media inventory to the baseline; check sibling links, directory URLs, and explicit `index.html` URLs. Treat interactive model integration as the next step's remaining work.

**Commit:** `feat: port all project case studies to React`

## Step 9 — Integrate the interactive media

1. Add a shared React wrapper around the existing `model-viewer` web component. Preserve controls, camera settings, and the three existing GLB models in CURSR-IV, AMIv2, and the ignition-module article.
2. Manage the model-viewer dependency through the package lockfile. Load its browser-only code once and on demand. Configure decoder dependencies deliberately instead of repeating global CDN setup snippets in article markup.
3. Provide model loading and failure states, accessible descriptions, and an intentional fallback if WebGL or the asset fails.
4. Add a reusable responsive video embed for the existing FPGA YouTube demo, retaining its title, fullscreen support, explanatory text, and external watch link.
5. Keep heavy viewers and model data out of unrelated pages' initial downloads. Respect reduced-motion preferences for automatic rotation and other optional motion.

**Verify:** Open each model in a real browser, exercise its controls, and test a failed asset. Confirm ordinary pages do not load the viewer or GLBs. Check the YouTube embed and its fallback link.

**Commit:** `feat: integrate lazy project media viewers`

## Step 10 — Integrate CV artifacts and preserve resume sources

1. Port the CV viewer and all CV download links to React, retaining the generated document's independent styling and print behavior.
2. Copy the explicit committed CV HTML and PDF paths into the build artifact. Fail the build clearly if either required document is missing; avoid broad `find` commands that can overwrite one output with unrelated documents.
3. Preserve every existing RenderCV YAML source and generated resume variant. Keep the current publication scope: the portfolio's CV links target the existing CV, while tailored resume variants remain available in the repository.
4. Keep RenderCV generation separate from the React application build. Document the generation command and compatible version based on the actual source/schema; do not hand-edit generated documents as the migration's source of truth.
5. Provide an accessible iframe title and direct document links on the viewer page.

**Verify:** The viewer, direct HTML document, and PDF links work beneath both deployment bases. Confirm document generation sources and tailored variants remain intact.

**Commit:** `feat: integrate CV viewer and document artifacts`

## Step 11 — Consolidate styles, accessibility, and media performance

1. Move reusable color/theme/spacing tokens and reset rules into shared styles. Scope component rules with CSS Modules or an equally clear convention.
2. Replace repeated inline styles and overly broad selectors with component rules. Preserve the original visual identity and compare against the baseline before accepting differences.
3. Check mobile navigation, grid widths, long titles, tables, code blocks, and the CV viewer for overflow. Use consistent box sizing and practical responsive constraints.
4. Add a skip link, clear focus indicators in both themes, suitable page/section headings, navigation landmarks, and reduced-motion handling.
5. Generate lightweight gallery thumbnails, particularly replacing the 5.38 MiB SPH GIF as a card thumbnail with a static poster. Preserve access to the animation in the detail page. Optimize large screenshots without losing readable technical details.
6. Add intrinsic image dimensions or aspect ratios where appropriate to reduce layout shifts, and lazy-load below-the-fold media. Keep primary content visible without waiting for JavaScript.

**Verify:** Compare representative desktop/mobile screenshots in both themes; check keyboard navigation and reduced motion; inspect for horizontal overflow and unnecessary media downloads. Measure image/viewer transfer sizes before and after the changes.

**Commit:** `refactor: consolidate styles and improve accessibility and media`

## Step 12 — Replace deployment and retire the legacy implementation

1. Add CI validation for pull requests and relevant pushes: clean dependency install, content validation, linting, focused tests, production build, and browser/static artifact checks.
2. Update GitHub Pages deployment to upload the validated React build output. Set the deployment base to `/portfolio/` and include package files, build configuration, scripts, content, and CV inputs in appropriate workflow triggers.
3. Keep deployment limited to the intended production event; pull-request checks must not deploy an unfinished preview as production.
4. Verify artifact contents and explicit CV copies. Keep source modules, tests, dependencies, caches, and temporary rendering outputs outside the published artifact.
5. After the replacement pages pass verification, remove superseded HTML application sources, sidebar-fetching code, meta-loader code, collection DOM scripts, duplicated inline initialization, and obsolete CSS. Retain required public assets and generated compatibility JSON endpoints.
6. Rewrite README instructions around the final folder layout, commands, URL/base-path behavior, content editing, adding projects/websites, CV regeneration, and deployment. Remove references to the old `portfolio/` source layout and the misleading claim that deployment renders the CV.

**Verify:** The workflow's commands pass locally from a clean install; its triggers cover all build inputs; the production artifact serves every required route and document. Check that no active code references removed scripts.

**Commit:** `build: deploy React portfolio and remove legacy frontend`

## Step 13 — Complete regression checks and record the handoff

1. Run the complete lint, content-validation, unit-test, production-build, and browser-check sequence. Test both `/portfolio/` and `/` using static serving that does not supply SPA fallbacks.
2. Check all fourteen page files, both homepage URL forms, project directory/index forms, internal cross-links, referenced assets, CV documents, and the 404 page. Inspect initial HTML with JavaScript disabled for readable content and page metadata.
3. Browser-check both themes at desktop and mobile widths; filtering/sorting combinations; keyboard interaction; persisted theme; missing-image fallback; all three 3D viewers; and the video/CV embeds. Confirm there are no hydration warnings, uncaught errors, or unexpected failed local requests.
4. Add only meaningful regression tests for behavior exposed by this work. Fix any remaining defects. Do not add tests that merely mirror component markup.
5. Record the final verification commands/results, material limitations, and updated content-editing workflow in the migration checklist. Clearly identify any browser or external-service checks that were unavailable.
6. Inspect the final diff and Git history. Confirm one commit per completed step, no unintended content loss, no committed build output, and no coauthor trailers.

**Verify:** All required checks pass and any remaining limitations are explicitly recorded. The working tree contains no unintended changes.

**Commit:** `test: complete React migration regression checks`

Finish by reporting the branch name, the ordered commits, the verification results, and any remaining limitations. Do not claim the port is complete while required pages, media, documents, or checks remain unfinished.

## Progress

- [x] Step 1 — Branch and baseline
- [x] Step 2 — Toolchain
- [x] Step 3 — Static rendering and URL compatibility
- [x] Step 4 — Canonical content and selectors
- [x] Step 5 — Layouts, navigation, and theme
- [x] Step 6 — About and Profile
- [x] Step 7 — Collections and error handling
- [x] Step 8 — All project narratives
- [x] Step 9 — Interactive media
- [ ] Step 10 — CV and resume artifacts
- [ ] Step 11 — Styles, accessibility, and performance
- [ ] Step 12 — Deployment, documentation, and legacy removal
- [ ] Step 13 — Final regression checks and handoff

## Technical references

- Vite prerendering: <https://vite.dev/guide/ssr.html>
- Vite GitHub Pages configuration: <https://vite.dev/guide/static-deploy#github-pages>
- React hydration: <https://react.dev/reference/react-dom/client/hydrateRoot>
- React derived-state guidance: <https://react.dev/learn/you-might-not-need-an-effect>
- Model viewer loading: <https://modelviewer.dev/examples/loading/>

Check documentation against the dependency versions actually installed during implementation.

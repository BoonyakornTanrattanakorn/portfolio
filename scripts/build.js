import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { MAIN_PAGES, getProjectPages } from '../site/src/pages.js';
import { normalizeBasePath, withBase } from '../site/src/utils/paths.js';
import { escapeHtml, escapeJsonForScript } from '../site/src/utils/html.js';
import { validateAllContent } from '../site/src/content/validate.js';

function parseArgs() {
  const args = process.argv.slice(2);
  let base = process.env.BASE_PATH || '/portfolio/';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base' && args[i + 1]) {
      base = args[i + 1];
      i++;
    }
  }
  return { base: normalizeBasePath(base) };
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

async function runBuild() {
  const { base } = parseArgs();
  console.log(`Building portfolio with base path: "${base}"...`);

  const root = process.cwd();
  const distDir = path.join(root, 'dist');
  const ssrDir = path.join(root, 'dist-ssr');
  const contentDir = path.join(root, 'site', 'content');

  // 1. Validate content before building
  console.log('1. Validating canonical content...');
  const validation = validateAllContent({ rootDir: root });
  if (!validation.valid) {
    console.error('Content validation failed:');
    for (const err of validation.errors) {
      console.error(` - ${err}`);
    }
    process.exit(1);
  }

  // 2. Build client assets with Vite
  console.log('2. Building client bundle...');
  await build({
    base,
    build: {
      outDir: distDir,
      emptyOutDir: true,
      manifest: true,
    },
  });

  // Extract client scripts and styles from the generated dist/index.html
  const clientHtmlTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const cssMatches = clientHtmlTemplate.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
  const scriptMatches = clientHtmlTemplate.match(/<script[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g) || [];
  const cssTags = cssMatches.join('\n    ');
  const scriptTags = scriptMatches.join('\n    ');

  // 3. Build SSR bundle with Vite
  console.log('3. Building SSR bundle...');
  await build({
    base,
    build: {
      ssr: 'site/src/entry-server.jsx',
      outDir: ssrDir,
      emptyOutDir: true,
    },
  });

  // 4. Load SSR bundle
  const ssrEntryPath = path.join(ssrDir, 'entry-server.js');
  const { renderPage } = await import(pathToFileURL(ssrEntryPath).href);

  // 5. Gather pages from canonical content
  console.log('4. Gathering canonical page manifest...');
  const projectsManifestPath = path.join(contentDir, 'projects.json');
  const rawSlugs = JSON.parse(fs.readFileSync(projectsManifestPath, 'utf8'));
  const projectsList = rawSlugs.map((slug) => {
    const metaPath = path.join(contentDir, 'projects', slug, 'meta.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    return { slug, ...meta };
  });

  const projectPages = getProjectPages(projectsList);
  const allPages = [...MAIN_PAGES, ...projectPages];

  // 6. Prerender each page
  console.log(`5. Prerendering ${allPages.length} pages...`);
  for (const page of allPages) {
    const { html } = renderPage({
      componentKey: page.componentKey,
      props: page.props,
      base,
    });

    const pageCanonicalUrl = withBase(page.outputPath, base);
    const finalHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${pageCanonicalUrl}" />
    <link rel="icon" href="${withBase('favicon.svg', base)}" type="image/svg+xml" />

    <!-- Open Graph / social preview -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${pageCanonicalUrl}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />

    <!-- Theme before paint -->
    <script>
      (function () {
        try {
          var s = localStorage.getItem('theme');
          var dark = s === 'dark' || (!s && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        } catch (e) {}
      })();
    </script>
    ${cssTags}
  </head>
  <body>
    <div id="root">${html}</div>
    <script id="__PORTFOLIO_DATA__" type="application/json">${escapeJsonForScript({
      componentKey: page.componentKey,
      props: page.props,
      base,
    })}</script>
    ${scriptTags}
  </body>
</html>
`;

    const destPath = path.join(distDir, page.outputPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, finalHtml, 'utf8');
  }

  // 7. Generate compatibility JSON endpoints at existing public manifest/metadata paths
  console.log('6. Generating compatibility JSON endpoints in dist/...');
  fs.mkdirSync(path.join(distDir, 'projects'), { recursive: true });
  fs.copyFileSync(projectsManifestPath, path.join(distDir, 'projects', 'projects.json'));
  for (const p of projectsList) {
    const slug = p.slug;
    const metaDest = path.join(distDir, 'projects', slug, 'meta.json');
    fs.mkdirSync(path.dirname(metaDest), { recursive: true });
    const metaSrc = path.join(contentDir, 'projects', slug, 'meta.json');
    fs.copyFileSync(metaSrc, metaDest);
  }

  const websitesManifestPath = path.join(contentDir, 'websites.json');
  fs.mkdirSync(path.join(distDir, 'websites'), { recursive: true });
  fs.copyFileSync(websitesManifestPath, path.join(distDir, 'websites', 'websites.json'));
  const websiteIds = JSON.parse(fs.readFileSync(websitesManifestPath, 'utf8'));
  for (const id of websiteIds) {
    const metaDest = path.join(distDir, 'websites', id, 'meta.json');
    fs.mkdirSync(path.dirname(metaDest), { recursive: true });
    const metaSrc = path.join(contentDir, 'websites', id, 'meta.json');
    fs.copyFileSync(metaSrc, metaDest);
  }

  // 8. Copy public assets and CV documents
  console.log('7. Copying public assets and CV documents...');
  const faviconSrc = path.join(root, 'site', 'favicon.svg');
  if (fs.existsSync(faviconSrc)) {
    fs.copyFileSync(faviconSrc, path.join(distDir, 'favicon.svg'));
  }

  const cvDest = path.join(distDir, 'CV');
  fs.mkdirSync(cvDest, { recursive: true });
  const cvHtmlSrc = path.join(root, 'CV', 'Boonyakorn_Tanrattanakorn_CV.html');
  const cvPdfSrc = path.join(root, 'CV', 'Boonyakorn_Tanrattanakorn_CV.pdf');
  if (fs.existsSync(cvHtmlSrc)) fs.copyFileSync(cvHtmlSrc, path.join(cvDest, 'Boonyakorn_Tanrattanakorn_CV.html'));
  if (fs.existsSync(cvPdfSrc)) fs.copyFileSync(cvPdfSrc, path.join(cvDest, 'Boonyakorn_Tanrattanakorn_CV.pdf'));

  const siteAssetsSrc = path.join(root, 'site', 'assets');
  if (fs.existsSync(siteAssetsSrc)) {
    copyRecursive(siteAssetsSrc, path.join(distDir, 'assets'));
  }

  // Copy project media
  for (const p of projectsList) {
    const slug = p.slug;
    const projectSrc = path.join(root, 'site', 'projects', slug);
    if (fs.existsSync(projectSrc)) {
      for (const file of fs.readdirSync(projectSrc)) {
        if (!file.endsWith('.html') && !file.endsWith('.md') && file !== 'meta.json') {
          const fileSrc = path.join(projectSrc, file);
          const fileDest = path.join(distDir, 'projects', slug, file);
          copyRecursive(fileSrc, fileDest);
        }
      }
    }
  }

  // Copy website media
  for (const id of websiteIds) {
    const webSrc = path.join(root, 'site', 'websites', id);
    if (fs.existsSync(webSrc)) {
      for (const file of fs.readdirSync(webSrc)) {
        if (!file.endsWith('.html') && !file.endsWith('.md') && file !== 'meta.json') {
          const fileSrc = path.join(webSrc, file);
          const fileDest = path.join(distDir, 'websites', id, file);
          copyRecursive(fileSrc, fileDest);
        }
      }
    }
  }

  // 9. Clean up SSR bundle directory
  console.log('8. Cleaning up temporary SSR bundle...');
  fs.rmSync(ssrDir, { recursive: true, force: true });

  console.log(`Build complete! Static site generated in dist/ (${allPages.length} pages rendered).`);
}

runBuild().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

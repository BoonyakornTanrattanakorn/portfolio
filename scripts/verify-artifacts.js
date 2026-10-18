import fs from 'node:fs';
import path from 'node:path';
import { getMainPages, getProjectPages } from '../site/src/pages.js';

export function verifyDistArtifacts({ distDir = path.join(process.cwd(), 'dist') } = {}) {
  const errors = [];

  if (!fs.existsSync(distDir)) {
    return { valid: false, errors: [`Build artifact directory does not exist: ${distDir}`] };
  }

  // 1. Check all main pages
  const mainPages = getMainPages();
  for (const page of mainPages) {
    const pagePath = path.join(distDir, page.outputPath);
    if (!fs.existsSync(pagePath)) {
      errors.push(`Missing main page artifact: ${page.outputPath}`);
    } else if (fs.statSync(pagePath).size === 0) {
      errors.push(`Empty main page artifact: ${page.outputPath}`);
    }
  }

  // 2. Check all 9 project pages
  const contentDir = path.join(process.cwd(), 'site', 'content');
  const projectsList = JSON.parse(fs.readFileSync(path.join(contentDir, 'projects.json'), 'utf8')).map((slug) => {
    return {
      slug,
      ...JSON.parse(fs.readFileSync(path.join(contentDir, 'projects', slug, 'meta.json'), 'utf8')),
    };
  });

  const projectPages = getProjectPages(projectsList);
  for (const p of projectPages) {
    const pagePath = path.join(distDir, p.outputPath);
    if (!fs.existsSync(pagePath)) {
      errors.push(`Missing project page artifact: ${p.outputPath}`);
    } else if (fs.statSync(pagePath).size === 0) {
      errors.push(`Empty project page artifact: ${p.outputPath}`);
    }
  }

  // 3. Check CV artifacts
  const cvHtml = path.join(distDir, 'CV', 'Boonyakorn_Tanrattanakorn_CV.html');
  const cvPdf = path.join(distDir, 'CV', 'Boonyakorn_Tanrattanakorn_CV.pdf');
  if (!fs.existsSync(cvHtml) || fs.statSync(cvHtml).size === 0) {
    errors.push('Missing or empty CV HTML in dist/CV/Boonyakorn_Tanrattanakorn_CV.html');
  }
  if (!fs.existsSync(cvPdf) || fs.statSync(cvPdf).size === 0) {
    errors.push('Missing or empty CV PDF in dist/CV/Boonyakorn_Tanrattanakorn_CV.pdf');
  }

  // 4. Check compatibility JSON endpoints
  const projectsJson = path.join(distDir, 'projects', 'projects.json');
  const websitesJson = path.join(distDir, 'websites', 'websites.json');
  if (!fs.existsSync(projectsJson) || fs.statSync(projectsJson).size === 0) {
    errors.push('Missing or empty dist/projects/projects.json compatibility endpoint');
  }
  if (!fs.existsSync(websitesJson) || fs.statSync(websitesJson).size === 0) {
    errors.push('Missing or empty dist/websites/websites.json compatibility endpoint');
  }

  // Check per-project and per-website meta.json
  for (const p of projectsList) {
    const metaPath = path.join(distDir, 'projects', p.slug, 'meta.json');
    if (!fs.existsSync(metaPath) || fs.statSync(metaPath).size === 0) {
      errors.push(`Missing or empty compatibility endpoint: projects/${p.slug}/meta.json`);
    }
  }

  // 5. Check public assets
  const favicon = path.join(distDir, 'favicon.svg');
  if (!fs.existsSync(favicon) || fs.statSync(favicon).size === 0) {
    errors.push('Missing or empty dist/favicon.svg');
  }
  const avatar = path.join(distDir, 'assets', 'avatar.jpg');
  if (!fs.existsSync(avatar) || fs.statSync(avatar).size === 0) {
    errors.push('Missing or empty dist/assets/avatar.jpg');
  }

  // 6. Ensure no temporary or source files leaked into dist
  function checkForbiddenFiles(dir) {
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (item === 'node_modules' || item === 'dist-ssr' || item === '.git') {
          errors.push(`Forbidden directory leaked into dist: ${item}`);
        } else {
          checkForbiddenFiles(fullPath);
        }
      } else {
        if (item.endsWith('.jsx') || item.includes('.test.') || item === 'package.json') {
          errors.push(`Forbidden source file leaked into dist: ${fullPath}`);
        }
      }
    }
  }
  checkForbiddenFiles(distDir);

  return {
    valid: errors.length === 0,
    errors,
  };
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/verify-artifacts.js')) {
  const result = verifyDistArtifacts();
  if (!result.valid) {
    console.error('Artifact verification failed:');
    for (const err of result.errors) {
      console.error(` - ${err}`);
    }
    process.exit(1);
  }
  console.log('Artifact verification passed! All required production artifacts are present and clean.');
}

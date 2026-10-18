import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getMainPages, getProjectPages } from '../site/src/pages.js';
import { verifyDistArtifacts } from '../scripts/verify-artifacts.js';
import { escapeHtml } from '../site/src/utils/html.js';

describe('Step 13: Final Regression and Architecture Verification', () => {
  const root = process.cwd();
  const distDir = path.join(root, 'dist');
  const contentDir = path.join(root, 'site', 'content');

  it('production artifact passes comprehensive artifact integrity verification', () => {
    const result = verifyDistArtifacts({ distDir });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('all 15 static HTML files contain prerendered semantic markup without relying on client JS', () => {
    const mainPages = getMainPages();
    const projectsList = JSON.parse(fs.readFileSync(path.join(contentDir, 'projects.json'), 'utf8')).map(
      (slug) => ({
        slug,
        ...JSON.parse(fs.readFileSync(path.join(contentDir, 'projects', slug, 'meta.json'), 'utf8')),
      })
    );
    const projectPages = getProjectPages(projectsList);
    const allPages = [...mainPages, ...projectPages];

    expect(allPages.length).toBe(15);

    for (const page of allPages) {
      const htmlPath = path.join(distDir, page.outputPath);
      expect(fs.existsSync(htmlPath), `File exists: ${page.outputPath}`).toBe(true);

      const html = fs.readFileSync(htmlPath, 'utf8');

      // Check required head elements
      expect(html.toLowerCase()).toContain('<!doctype html>');
      expect(html).toContain('<meta name="viewport"');
      expect(html).toContain('<title>');
      expect(html).toContain(escapeHtml(page.title));

      // Check theme initialization script prevents FOUC
      expect(html).toContain('localStorage.getItem(\'theme\')');
      expect(html).toContain('document.documentElement.setAttribute(\'data-theme\'');

      // Check skip link and accessible landmark
      expect(html).toContain('<a href="#main-content" class="skip-link">Skip to main content</a>');
      expect(html).toContain('id="main-content"');

      // Check hydration data payload is present
      expect(html).toContain('id="__PORTFOLIO_DATA__"');

      // Check prerendered content exists inside #root
      expect(html).toContain('<div id="root">');
      expect(html).toContain('class="portfolio-app"');
    }
  });

  it('compatibility JSON endpoints exactly reflect canonical content data', () => {
    const canonicalProjects = JSON.parse(fs.readFileSync(path.join(contentDir, 'projects.json'), 'utf8'));
    const distProjects = JSON.parse(fs.readFileSync(path.join(distDir, 'projects', 'projects.json'), 'utf8'));
    expect(distProjects).toEqual(canonicalProjects);

    const canonicalWebsites = JSON.parse(fs.readFileSync(path.join(contentDir, 'websites.json'), 'utf8'));
    const distWebsites = JSON.parse(fs.readFileSync(path.join(distDir, 'websites', 'websites.json'), 'utf8'));
    expect(distWebsites).toEqual(canonicalWebsites);

    for (const slug of canonicalProjects) {
      const canonicalMeta = JSON.parse(fs.readFileSync(path.join(contentDir, 'projects', slug, 'meta.json'), 'utf8'));
      const distMeta = JSON.parse(fs.readFileSync(path.join(distDir, 'projects', slug, 'meta.json'), 'utf8'));
      expect(distMeta).toEqual(canonicalMeta);
    }
  });

  it('no legacy frontend files or dead code remain in the site source tree', () => {
    expect(fs.existsSync(path.join(root, 'site', 'index.html'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'site', 'profile.html'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'site', 'projects.html'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'site', 'websites.html'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'site', 'cv.html'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'site', 'sidebar.html'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'site', 'assets', 'js'))).toBe(false);
  });

  it('both CV document formats exist and are non-empty in dist/CV', () => {
    const htmlCv = path.join(distDir, 'CV', 'Boonyakorn_Tanrattanakorn_CV.html');
    const pdfCv = path.join(distDir, 'CV', 'Boonyakorn_Tanrattanakorn_CV.pdf');

    expect(fs.existsSync(htmlCv)).toBe(true);
    expect(fs.existsSync(pdfCv)).toBe(true);

    const htmlSize = fs.statSync(htmlCv).size;
    const pdfSize = fs.statSync(pdfCv).size;

    expect(htmlSize).toBeGreaterThan(5000);
    expect(pdfSize).toBeGreaterThan(10000);
  });
});

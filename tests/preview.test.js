import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createPreviewServer } from '../scripts/preview.js';

describe('static preview server and URL compatibility', () => {
  let serverPortfolio;
  let serverRoot;
  const portPortfolio = 4180;
  const portRoot = 4181;

  beforeAll(async () => {
    await new Promise((resolve) => {
      serverPortfolio = createPreviewServer({ base: '/portfolio/', port: portPortfolio });
      serverPortfolio.listen(portPortfolio, resolve);
    });
    await new Promise((resolve) => {
      serverRoot = createPreviewServer({ base: '/', port: portRoot });
      serverRoot.listen(portRoot, resolve);
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => serverPortfolio.close(resolve));
    await new Promise((resolve) => serverRoot.close(resolve));
  });

  describe('Base /portfolio/', () => {
    it('serves homepage at /portfolio/ with initial rendered HTML', async () => {
      const res = await fetch(`http://localhost:${portPortfolio}/portfolio/`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('Boonyakorn Tanrattanakorn');
      expect(text).toContain('id="__PORTFOLIO_DATA__"');
      expect(text).toContain('data-component="home"');
    });

    it('serves homepage at /portfolio/index.html with matching content', async () => {
      const res = await fetch(`http://localhost:${portPortfolio}/portfolio/index.html`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('Boonyakorn Tanrattanakorn');
    });

    it('redirects / to /portfolio/', async () => {
      const res = await fetch(`http://localhost:${portPortfolio}/`, { redirect: 'manual' });
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toBe('/portfolio/');
    });

    it('serves main pages like /portfolio/profile.html', async () => {
      const res = await fetch(`http://localhost:${portPortfolio}/portfolio/profile.html`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('Profile — Boonyakorn Tanrattanakorn');
    });

    it('serves nested project directory and explicit index.html identically', async () => {
      const dirRes = await fetch(`http://localhost:${portPortfolio}/portfolio/projects/cursr-iv/`);
      const fileRes = await fetch(`http://localhost:${portPortfolio}/portfolio/projects/cursr-iv/index.html`);
      expect(dirRes.status).toBe(200);
      expect(fileRes.status).toBe(200);
      const dirText = await dirRes.text();
      const fileText = await fileRes.text();
      expect(dirText).toBe(fileText);
      expect(dirText).toContain('Project CURSR-IV');
    });

    it('redirects directory path without trailing slash to trailing slash', async () => {
      const res = await fetch(`http://localhost:${portPortfolio}/portfolio/projects/cursr-iv`, {
        redirect: 'manual',
      });
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toBe('/portfolio/projects/cursr-iv/');
    });

    it('returns 404 for unknown path under base with static 404 page', async () => {
      const res = await fetch(`http://localhost:${portPortfolio}/portfolio/non-existent-page.html`);
      expect(res.status).toBe(404);
      const text = await res.text();
      expect(text).toContain('404 — Page Not Found');
    });

    it('returns 404 for paths outside base', async () => {
      const res = await fetch(`http://localhost:${portPortfolio}/random-outside-path`);
      expect(res.status).toBe(404);
    });

    it('serves CV HTML and PDF documents', async () => {
      const htmlRes = await fetch(
        `http://localhost:${portPortfolio}/portfolio/CV/Boonyakorn_Tanrattanakorn_CV.html`
      );
      expect(htmlRes.status).toBe(200);
      const pdfRes = await fetch(
        `http://localhost:${portPortfolio}/portfolio/CV/Boonyakorn_Tanrattanakorn_CV.pdf`
      );
      expect(pdfRes.status).toBe(200);
      expect(pdfRes.headers.get('content-type')).toBe('application/pdf');
    });
  });

  describe('Base / (Root hosted)', () => {
    it('serves homepage directly at /', async () => {
      const res = await fetch(`http://localhost:${portRoot}/`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('Boonyakorn Tanrattanakorn');
    });

    it('serves nested project at /projects/cursr-iv/', async () => {
      const res = await fetch(`http://localhost:${portRoot}/projects/cursr-iv/`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('Project CURSR-IV');
    });

    it('returns 404 on missing path', async () => {
      const res = await fetch(`http://localhost:${portRoot}/missing`);
      expect(res.status).toBe(404);
      const text = await res.text();
      expect(text).toContain('404 — Page Not Found');
    });
  });
});

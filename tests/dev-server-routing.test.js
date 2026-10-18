import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'vite';
import { resolveRouteFromPath, ALL_PROJECTS, ALL_WEBSITES, ALL_SKILLS } from '../site/src/content/data.js';

describe('dev mode and client-side routing resolution', () => {
  describe('resolveRouteFromPath', () => {
    it('resolves home page for root and index.html', () => {
      const r1 = resolveRouteFromPath('/', '/');
      expect(r1.componentKey).toBe('home');
      expect(r1.props.skills.length).toBeGreaterThan(0);
      expect(r1.props.skills).toEqual(ALL_SKILLS);
      expect(r1.props.projectCount).toBe(9);

      const r2 = resolveRouteFromPath('/index.html', '/');
      expect(r2.componentKey).toBe('home');

      const r3 = resolveRouteFromPath('/portfolio/', '/portfolio/');
      expect(r3.componentKey).toBe('home');

      const r4 = resolveRouteFromPath('/portfolio/index.html', '/portfolio/');
      expect(r4.componentKey).toBe('home');
    });

    it('resolves profile page', () => {
      const r1 = resolveRouteFromPath('/profile.html', '/');
      expect(r1.componentKey).toBe('profile');

      const r2 = resolveRouteFromPath('/portfolio/profile.html', '/portfolio/');
      expect(r2.componentKey).toBe('profile');
    });

    it('resolves projects page with all projects data', () => {
      const r1 = resolveRouteFromPath('/projects.html', '/');
      expect(r1.componentKey).toBe('projects');
      expect(r1.props.projects.length).toBe(9);
      expect(r1.props.projects).toEqual(ALL_PROJECTS);

      const r2 = resolveRouteFromPath('/portfolio/projects.html', '/portfolio/');
      expect(r2.componentKey).toBe('projects');
    });

    it('resolves websites page with all websites data', () => {
      const r1 = resolveRouteFromPath('/websites.html', '/');
      expect(r1.componentKey).toBe('websites');
      expect(r1.props.websites.length).toBe(2);
      expect(r1.props.websites).toEqual(ALL_WEBSITES);

      const r2 = resolveRouteFromPath('/portfolio/websites.html', '/portfolio/');
      expect(r2.componentKey).toBe('websites');
    });

    it('resolves cv page', () => {
      const r1 = resolveRouteFromPath('/cv.html', '/');
      expect(r1.componentKey).toBe('cv');

      const r2 = resolveRouteFromPath('/portfolio/cv.html', '/portfolio/');
      expect(r2.componentKey).toBe('cv');
    });

    it('resolves project detail page with slug and metadata', () => {
      const r1 = resolveRouteFromPath('/projects/cursr-iv/', '/');
      expect(r1.componentKey).toBe('project-detail');
      expect(r1.props.slug).toBe('cursr-iv');
      expect(r1.props.title).toBe('Project CURSR-IV — Avionics');

      const r2 = resolveRouteFromPath('/portfolio/projects/sph-simulator/index.html', '/portfolio/');
      expect(r2.componentKey).toBe('project-detail');
      expect(r2.props.slug).toBe('sph-simulator');
    });

    it('returns 404 for unknown routes or invalid project slugs', () => {
      const r1 = resolveRouteFromPath('/unknown-path.html', '/');
      expect(r1.componentKey).toBe('404');

      const r2 = resolveRouteFromPath('/projects/non-existent-project/', '/');
      expect(r2.componentKey).toBe('404');
    });
  });

  describe('Vite dev server static asset serving', () => {
    let devServer;
    const devPort = 5195;

    beforeAll(async () => {
      devServer = await createServer({
        configFile: './vite.config.js',
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { port: devPort },
      });
      await devServer.listen();
    });

    afterAll(async () => {
      if (devServer) {
        await devServer.close();
      }
    });

    it('serves profile avatar with image/jpeg content type', async () => {
      const res = await fetch(`http://localhost:${devPort}/assets/avatar.jpg`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('image/jpeg');
    });

    it('serves project media (e.g. SPH poster) with correct image content type', async () => {
      const res = await fetch(`http://localhost:${devPort}/projects/sph-simulator/sph-poster.png`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('image/png');
    });

    it('serves CV HTML document with text/html content type', async () => {
      const res = await fetch(`http://localhost:${devPort}/CV/Boonyakorn_Tanrattanakorn_CV.html`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/html');
      const text = await res.text();
      expect(text).toContain('Boonyakorn Tanrattanakorn');
    });

    it('serves CV PDF document with application/pdf content type', async () => {
      const res = await fetch(`http://localhost:${devPort}/CV/Boonyakorn_Tanrattanakorn_CV.pdf`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/pdf');
    });

    it('serves favicon with image/svg+xml content type', async () => {
      const res = await fetch(`http://localhost:${devPort}/favicon.svg`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('image/svg+xml');
    });

    it('falls back to index.html for page routes in dev server', async () => {
      const res = await fetch(`http://localhost:${devPort}/projects.html`);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/html');
      const text = await res.text();
      expect(text).toContain('<div id="root">');
      expect(text).toContain('/site/src/entry-client.jsx');
    });
  });
});

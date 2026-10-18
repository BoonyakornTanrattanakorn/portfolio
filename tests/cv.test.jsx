import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import CvPage from '../site/src/pages/CvPage.jsx';
import Sidebar from '../site/src/components/Sidebar.jsx';
import { ThemeProvider } from '../site/src/theme/ThemeContext.jsx';

describe('CV Artifacts and Viewer', () => {
  it('renders CvPage with accessible iframe and direct document links under /portfolio/ base', () => {
    const html = renderToString(
      <ThemeProvider>
        <CvPage base="/portfolio/" />
      </ThemeProvider>
    );

    // Direct document links
    expect(html).toContain('href="/portfolio/CV/Boonyakorn_Tanrattanakorn_CV.html"');
    expect(html).toContain('href="/portfolio/CV/Boonyakorn_Tanrattanakorn_CV.pdf"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');

    // Accessible iframe
    expect(html).toContain('class="embed-frame"');
    expect(html).toContain('src="/portfolio/CV/Boonyakorn_Tanrattanakorn_CV.html"');
    expect(html).toContain('title="Curriculum Vitae of Boonyakorn Tanrattanakorn"');
  });

  it('renders CvPage with correct document links under root / base', () => {
    const html = renderToString(
      <ThemeProvider>
        <CvPage base="/" />
      </ThemeProvider>
    );

    expect(html).toContain('href="/CV/Boonyakorn_Tanrattanakorn_CV.html"');
    expect(html).toContain('href="/CV/Boonyakorn_Tanrattanakorn_CV.pdf"');
    expect(html).toContain('src="/CV/Boonyakorn_Tanrattanakorn_CV.html"');
  });

  it('renders Sidebar with working CV viewer and PDF links', () => {
    const html = renderToString(
      <Sidebar current="cv" base="/portfolio/" />
    );

    expect(html).toContain('href="/portfolio/cv.html"');
    expect(html).toContain('href="/portfolio/CV/Boonyakorn_Tanrattanakorn_CV.pdf"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('preserves all committed CV documents and RenderCV source variants in repository', () => {
    const root = process.cwd();
    // Required CV artifacts
    expect(fs.existsSync(path.join(root, 'CV/CV.yaml'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'CV/Boonyakorn_Tanrattanakorn_CV.html'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'CV/Boonyakorn_Tanrattanakorn_CV.pdf'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'CV/Boonyakorn_Tanrattanakorn_CV.typ'))).toBe(true);

    // Preserved tailored resume variants
    expect(fs.existsSync(path.join(root, 'resume/Photonics_CV.yaml'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'resume/resume.yaml'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'resume/WebDevResume.yaml'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'resume/WebDevResume/Boonyakorn_Tanrattanakorn_WebDev.html'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'resume/WebDevResume/Boonyakorn_Tanrattanakorn_WebDev.pdf'))).toBe(true);

    // Verify RenderCV schema version
    const cvYaml = fs.readFileSync(path.join(root, 'CV/CV.yaml'), 'utf8');
    expect(cvYaml).toContain('rendercv/refs/tags/v2.6/schema.json');
  });
});

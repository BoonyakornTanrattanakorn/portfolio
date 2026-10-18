import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import AppLayout from '../site/src/components/AppLayout.jsx';
import ProjectLayout from '../site/src/components/ProjectLayout.jsx';
import Card from '../site/src/features/collections/Card.jsx';
import { ThemeProvider } from '../site/src/theme/ThemeContext.jsx';

describe('styles, accessibility, and media performance', () => {
  const cssPath = path.resolve('site/assets/css/styles.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  it('contains essential CSS rules for accessibility and performance', () => {
    expect(cssContent).toContain('box-sizing: border-box');
    expect(cssContent).toContain(':focus-visible');
    expect(cssContent).toContain('.skip-link');
    expect(cssContent).toContain('prefers-reduced-motion');
    expect(cssContent).toContain('.model-fallback');
    expect(cssContent).toContain('pre {');
  });

  it('renders skip link and accessible main landmark in AppLayout', () => {
    const html = renderToString(
      <ThemeProvider>
        <AppLayout currentNav="about" base="/portfolio/">
          <p>Hello world</p>
        </AppLayout>
      </ThemeProvider>
    );

    expect(html).toContain('<a href="#main-content" class="skip-link">Skip to main content</a>');
    expect(html).toContain('id="main-content"');
    expect(html).toContain('tabindex="-1"');
  });

  it('renders skip link and accessible main landmark in ProjectLayout', () => {
    const html = renderToString(
      <ThemeProvider>
        <ProjectLayout
          title="Test Project"
          date="2025"
          base="/portfolio/"
        >
          <p>Detail content</p>
        </ProjectLayout>
      </ThemeProvider>
    );

    expect(html).toContain('<a href="#main-content" class="skip-link">Skip to main content</a>');
    expect(html).toContain('<main id="main-content" class="wrap" tabindex="-1">');
  });

  it('renders card thumbnails with intrinsic width and height to prevent CLS', () => {
    const item = {
      slug: 'test-project',
      title: 'Test Project',
      thumbnail: 'thumb.jpg',
      date: '2025',
    };

    const html = renderToString(
      <Card
        item={item}
        href="/portfolio/projects/test-project/"
        base="/portfolio/"
        mediaBase="projects/"
      />
    );

    expect(html).toContain('width="300"');
    expect(html).toContain('height="140"');
    expect(html).toContain('loading="lazy"');
  });

  it('SPH thumbnail poster is lightweight compared to original GIF', () => {
    const posterPath = path.resolve('site/projects/sph-simulator/sph-poster.png');
    const gifPath = path.resolve('site/projects/sph-simulator/sph.gif');

    expect(fs.existsSync(posterPath)).toBe(true);
    expect(fs.existsSync(gifPath)).toBe(true);

    const posterSize = fs.statSync(posterPath).size;
    const gifSize = fs.statSync(gifPath).size;

    // Poster should be under 100 KB, while original GIF is ~5.38 MB (> 5,000,000 bytes)
    expect(posterSize).toBeLessThan(100 * 1024);
    expect(gifSize).toBeGreaterThan(5 * 1024 * 1024);
    expect(posterSize).toBeLessThan(gifSize * 0.02); // >98% size reduction
  });
});

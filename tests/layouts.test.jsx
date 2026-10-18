import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import Sidebar from '../site/src/components/Sidebar.jsx';
import AppLayout from '../site/src/components/AppLayout.jsx';
import ProjectLayout from '../site/src/components/ProjectLayout.jsx';
import { ThemeProvider } from '../site/src/theme/ThemeContext.jsx';

describe('Shared layouts, navigation, and theme', () => {
  it('renders sidebar with navigation landmark and aria-current on active link', () => {
    const html = renderToString(
      <ThemeProvider>
        <Sidebar currentNav="profile" base="/portfolio/" />
      </ThemeProvider>
    );

    // Navigation landmark
    expect(html).toContain('aria-label="Main Navigation"');

    // Profile link active
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('nav-btn active');
    expect(html).toContain('href="/portfolio/profile.html"');

    // Home link not active
    expect(html).toContain('href="/portfolio/index.html"');
    expect(html).not.toMatch(/class="[^"]*nav-btn active[^"]*"[^>]*href="\/portfolio\/index\.html"/);

    // External social links
    expect(html).toContain('href="https://github.com/BoonyakornTanrattanakorn"');
    expect(html).toContain('href="https://www.linkedin.com/in/boonyakorn-tanrattanakorn/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');

    // Theme toggle button
    expect(html).toContain('id="theme-toggle"');
    expect(html).toContain('class="theme-toggle"');
  });

  it('renders AppLayout with sidebar and wrapped content container', () => {
    const html = renderToString(
      <ThemeProvider>
        <AppLayout currentNav="home" base="/">
          <p id="test-child">Child Content</p>
        </AppLayout>
      </ThemeProvider>
    );

    expect(html).toContain('class="app-layout"');
    expect(html).toContain('class="app-content"');
    expect(html).toContain('class="wrap"');
    expect(html).toContain('id="test-child"');
    expect(html).toContain('Child Content');
  });

  it('renders ProjectLayout with back link, meta, tags, and body', () => {
    const html = renderToString(
      <ProjectLayout
        title="Sample Flight Computer"
        date="2026"
        organization="CUHAR"
        role="Lead"
        tags={['STM32', 'LoRa']}
        thumbnail="thumb.png"
        summary="A flight computer."
        base="/portfolio/"
      >
        <p>Project Narrative</p>
      </ProjectLayout>
    );

    expect(html).toContain('href="/portfolio/projects.html"');
    expect(html).toContain('← Back to Portfolio');
    expect(html).toContain('Sample Flight Computer');
    expect(html).toContain('2026');
    expect(html).toContain('CUHAR');
    expect(html).toContain('Role: Lead');
    expect(html).toContain('class="tag"');
    expect(html).toContain('STM32');
    expect(html).toContain('LoRa');
    expect(html).toContain('Project Narrative');
  });
});

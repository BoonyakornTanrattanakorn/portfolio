import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import Card from '../site/src/features/collections/Card.jsx';
import CollectionControls from '../site/src/features/collections/CollectionControls.jsx';
import CollectionGrid from '../site/src/features/collections/CollectionGrid.jsx';
import ProjectsPage from '../site/src/pages/ProjectsPage.jsx';
import WebsitesPage from '../site/src/pages/WebsitesPage.jsx';
import { ThemeProvider } from '../site/src/theme/ThemeContext.jsx';

const SAMPLE_PROJECT = {
  id: 'cursr-iv',
  title: 'Project CURSR-IV — Avionics',
  role: 'PCB Designer & Firmware Developer',
  date: '2024',
  organization: 'Chulalongkorn University',
  tags: ['STM32', 'KiCad', 'PCB'],
  thumbnail: 'cursr.png',
  summary: 'Designed a 4-layer SMT flight computer PCB.',
};

const SAMPLE_WEBSITE_LIVE = {
  id: 'ACC26FlightDataVisualization',
  title: 'Flight Data Visualizer',
  role: 'Full-Stack Developer',
  date: '2024',
  organization: 'Personal Project',
  tags: ['React', 'D3.js'],
  thumbnail: 'ACC26.png',
  summary: 'Interactive real-time telemetry plotting.',
  url: 'https://example.com/telemetry',
  status: 'live',
};

const SAMPLE_WEBSITE_ARCHIVED = {
  id: 'OldArchivedSite',
  title: 'Archived Prototype',
  role: 'Author',
  date: '2021',
  organization: 'Lab',
  tags: ['HTML', 'CSS'],
  thumbnail: 'archived.png',
  summary: 'Legacy web prototype.',
  url: 'https://example.com/archived',
  status: 'archived',
};

describe('Collection Components', () => {
  describe('Card Component', () => {
    it('renders project card as an internal link without external mark or status pill', () => {
      const html = renderToString(
        <Card
          item={SAMPLE_PROJECT}
          href="/portfolio/projects/cursr-iv/index.html"
          isExternal={false}
          base="/portfolio/"
          mediaBase="projects/"
        />
      );

      expect(html).toContain('href="/portfolio/projects/cursr-iv/index.html"');
      expect(html).toContain('Project CURSR-IV — Avionics');
      expect(html).toContain('src="/portfolio/projects/cursr-iv/cursr.png"');
      expect(html).toContain('class="card-meta"');
      expect(html).toContain('2024 \u00a0·\u00a0 Chulalongkorn University \u00a0·\u00a0 PCB Designer &amp; Firmware Developer');
      expect(html).toContain('class="tag">STM32</span>');
      expect(html).toContain('class="tag">KiCad</span>');
      expect(html).toContain('class="tag">PCB</span>');
      // No external target, no external mark, no status pill
      expect(html).not.toContain('target="_blank"');
      expect(html).not.toContain('ext-mark');
      expect(html).not.toContain('status-pill');
    });

    it('renders website card with target blank, rel noopener, external mark, and status pill', () => {
      const html = renderToString(
        <Card
          item={SAMPLE_WEBSITE_LIVE}
          href={SAMPLE_WEBSITE_LIVE.url}
          isExternal={true}
          base="/portfolio/"
          mediaBase="websites/"
        />
      );

      expect(html).toContain('href="https://example.com/telemetry"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
      expect(html).toContain('class="ext-mark"');
      expect(html).toContain('↗');
      expect(html).toContain('class="status-pill status-live"');
      expect(html).toContain('live');
    });

    it('adds is-archived class and status-archived pill for archived items', () => {
      const html = renderToString(
        <Card
          item={SAMPLE_WEBSITE_ARCHIVED}
          href={SAMPLE_WEBSITE_ARCHIVED.url}
          isExternal={true}
          base="/portfolio/"
          mediaBase="websites/"
        />
      );

      expect(html).toContain('class="card is-archived"');
      expect(html).toContain('class="status-pill status-archived"');
      expect(html).toContain('archived');
    });

    it('renders placeholder when thumbnail is missing or empty', () => {
      const projectWithoutThumb = { ...SAMPLE_PROJECT, thumbnail: '' };
      const html = renderToString(
        <Card
          item={projectWithoutThumb}
          href="/portfolio/projects/cursr-iv/index.html"
          isExternal={false}
          base="/portfolio/"
        />
      );

      expect(html).toContain('class="card-thumb-placeholder"');
      expect(html).toContain('No image');
      expect(html).not.toContain('<img');
    });
  });

  describe('CollectionControls Component', () => {
    it('renders search input, sort selector, tag buttons, and live region', () => {
      const allTags = ['C++', 'KiCad', 'STM32'];
      const selectedTags = ['STM32'];

      const html = renderToString(
        <CollectionControls
          noun="projects"
          query="flight"
          onQueryChange={() => {}}
          sortMode="az"
          onSortChange={() => {}}
          allTags={allTags}
          selectedTags={selectedTags}
          onToggleTag={() => {}}
          totalResults={1}
        />
      );

      // Search input
      expect(html).toContain('placeholder="Search projects (title, summary, tags)"');
      expect(html).toContain('value="flight"');

      // Sort selector
      expect(html).toContain('id="sort"');
      expect(html).toContain('value="az"');

      // Tag buttons with aria-pressed
      expect(html).toContain('data-tag="STM32"');
      expect(html).toContain('class="tag-filter active"');
      expect(html).toContain('aria-pressed="true"');

      expect(html).toContain('data-tag="KiCad"');
      expect(html).toContain('class="tag-filter"');
      expect(html).toContain('aria-pressed="false"');

      // Live region announcement
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-live="polite"');
      expect(html).toContain('Showing 1 projects.');
    });

    it('announces zero results in live region when totalResults is 0', () => {
      const html = renderToString(
        <CollectionControls
          noun="projects"
          query="nonexistent"
          onQueryChange={() => {}}
          sortMode="newest"
          onSortChange={() => {}}
          allTags={[]}
          selectedTags={[]}
          onToggleTag={() => {}}
          totalResults={0}
        />
      );

      expect(html).toContain('No projects found.');
    });
  });

  describe('CollectionGrid & Error Handling', () => {
    it('renders grid with valid items', () => {
      const html = renderToString(
        <CollectionGrid
          items={[SAMPLE_PROJECT]}
          noun="projects"
          cardHref={(id) => `/projects/${id}/index.html`}
          mediaBase="projects/"
          base="/"
        />
      );

      expect(html).toContain('Project CURSR-IV — Avionics');
      expect(html).toContain('id="project-grid"');
      expect(html).not.toContain('No projects found.');
      expect(html).not.toContain('error-msg');
    });

    it('renders empty message when items array is empty', () => {
      const html = renderToString(
        <CollectionGrid
          items={[]}
          noun="projects"
          cardHref={(id) => `/projects/${id}/index.html`}
        />
      );

      expect(html).toContain('No projects found.');
    });

    it('displays collection-level error without rendering misleading empty message', () => {
      const html = renderToString(
        <CollectionGrid
          items={[]}
          noun="projects"
          error="Network timeout 504"
          cardHref={(id) => `/projects/${id}/index.html`}
        />
      );

      expect(html).toContain('class="error-msg"');
      expect(html).toContain('Failed to load projects: Network timeout 504');
      expect(html).not.toContain('No projects found.');
    });

    it('displays item-level errors and preserves valid items instead of erasing errors', () => {
      const itemsWithOneFailure = [
        SAMPLE_PROJECT,
        { id: 'corrupt-project', error: 'Invalid JSON metadata' },
      ];

      const html = renderToString(
        <CollectionGrid
          items={itemsWithOneFailure}
          noun="projects"
          cardHref={(id) => `/projects/${id}/index.html`}
          mediaBase="projects/"
          base="/"
        />
      );

      // Error message is preserved and visible
      expect(html).toContain('class="error-msg"');
      expect(html).toContain('Could not load &quot;corrupt-project&quot;: Invalid JSON metadata');

      // Valid project is also rendered!
      expect(html).toContain('Project CURSR-IV — Avionics');
      expect(html).not.toContain('No projects found.');
    });
  });

  describe('ProjectsPage and WebsitesPage Integration', () => {
    it('renders ProjectsPage with prerendered projects', () => {
      const html = renderToString(
        <ThemeProvider>
          <ProjectsPage
            projects={[SAMPLE_PROJECT]}
            base="/portfolio/"
          />
        </ThemeProvider>
      );

      expect(html).toContain('Portfolio</h1>');
      expect(html).toContain('Selected projects and highlights.');
      expect(html).toContain('Project CURSR-IV — Avionics');
      expect(html).toContain('href="/portfolio/projects/cursr-iv/index.html"');
    });

    it('renders WebsitesPage with prerendered websites and external links', () => {
      const html = renderToString(
        <ThemeProvider>
          <WebsitesPage
            websites={[SAMPLE_WEBSITE_LIVE, SAMPLE_WEBSITE_ARCHIVED]}
            base="/portfolio/"
          />
        </ThemeProvider>
      );

      expect(html).toContain('Websites</h1>');
      expect(html).toContain('Sites I&#x27;ve built.');
      expect(html).toContain('Flight Data Visualizer');
      expect(html).toContain('href="https://example.com/telemetry"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('class="status-pill status-live"');
      expect(html).toContain('Archived Prototype');
      expect(html).toContain('class="status-pill status-archived"');
    });
  });
});

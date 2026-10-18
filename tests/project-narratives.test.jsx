import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import ProjectDetailPage, { PROJECT_BODIES } from '../site/src/pages/ProjectDetailPage.jsx';
import { ThemeProvider } from '../site/src/theme/ThemeContext.jsx';
import { THUMBNAIL_PLACEHOLDER } from '../site/src/components/ProjectLayout.jsx';
import { escapeHtml } from '../site/src/utils/html.js';

const contentDir = path.resolve(process.cwd(), 'site/content');
const projectsManifest = JSON.parse(
  fs.readFileSync(path.join(contentDir, 'projects.json'), 'utf8')
);

describe('Project Case Studies and Narratives', () => {
  it('has a narrative body registered for all nine projects in manifest', () => {
    expect(projectsManifest).toHaveLength(9);
    for (const slug of projectsManifest) {
      expect(PROJECT_BODIES[slug]).toBeDefined();
    }
  });

  projectsManifest.forEach((slug) => {
    it(`renders complete detail page for "${slug}"`, () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects', slug, 'meta.json'), 'utf8')
      );

      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage
            slug={slug}
            title={meta.title}
            summary={meta.summary}
            date={meta.date}
            organization={meta.organization}
            role={meta.role}
            tags={meta.tags}
            thumbnail={meta.thumbnail}
            base="/portfolio/"
          />
        </ThemeProvider>
      );

      // Back link
      expect(html).toContain('href="/portfolio/projects.html"');
      expect(html).toContain('← Back to Portfolio');

      // Title & Meta
      expect(html).toContain(`id="project-title">${escapeHtml(meta.title)}</h1>`);
      expect(html).toContain(escapeHtml(meta.organization));
      expect(html).toContain(`Role: ${escapeHtml(meta.role)}`);

      // Tags
      for (const tag of meta.tags) {
        expect(html).toContain(`class="tag">${tag}</span>`);
      }

      // Thumbnail check
      if (meta.thumbnail) {
        expect(html).toContain(`src="/portfolio/projects/${slug}/${meta.thumbnail}"`);
      } else {
        expect(html).toContain(THUMBNAIL_PLACEHOLDER);
      }

      // Caption
      expect(html).toContain(`id="project-thumb-caption">${meta.summary}</figcaption>`);
    });
  });

  describe('Specific project narratives content checks', () => {
    it('xsrt-rocket-test-bench links to ematch-ignition-module', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/xsrt-rocket-test-bench/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="xsrt-rocket-test-bench" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('href="/portfolio/projects/ematch-ignition-module/index.html"');
      expect(html).toContain('Dual-Channel E-Match Ignition Module');
      expect(html).toContain('Servo-Actuated Ball Valves (SABV)');
    });

    it('ematch-ignition-module has model-viewer, figures, and link to test bench', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/ematch-ignition-module/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="ematch-ignition-module" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('href="/portfolio/projects/xsrt-rocket-test-bench/index.html"');
      expect(html).toContain('src="/portfolio/projects/ematch-ignition-module/ignition_module.glb"');
      expect(html).toContain('src="/portfolio/projects/ematch-ignition-module/weirdly_hot_mosfet.jpg"');
      expect(html).toContain('src="/portfolio/projects/ematch-ignition-module/oscilloscope_test.jpg"');
      expect(html).toContain('src="/portfolio/projects/ematch-ignition-module/dummy_load_test.jpg"');
      expect(html).toContain('Capacitive Discharge Reservoir');
    });

    it('engineering-internship renders metadata table, figures, and XeLaTeX details', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/engineering-internship/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="engineering-internship" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('Attakawin Paetep');
      expect(html).toContain('src="/portfolio/projects/engineering-internship/debugging.jpg"');
      expect(html).toContain('src="/portfolio/projects/engineering-internship/CAD.png"');
      expect(html).toContain('src="/portfolio/projects/engineering-internship/electrolysis.jpg"');
      expect(html).toContain('The Report Repository');
      expect(html).toContain('\\thaiurl');
    });

    it('fpga-video-player contains responsive YouTube embed and repo tree', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/fpga-video-player/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="fpga-video-player" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('src="https://www.youtube.com/embed/p0MyfT0LiCs"');
      expect(html).toContain('https://www.youtube.com/watch?v=p0MyfT0LiCs');
      expect(html).toContain('TopModule.v');
      expect(html).toContain('sd_master.v');
    });

    it('weather-station renders architecture figure and STM32/ESP32 boxes', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/weather-station/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="weather-station" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('src="/portfolio/projects/weather-station/rain-gauge.jpg"');
      expect(html).toContain('class="arch-box"');
      expect(html).toContain('ESP32-S3');
    });

    it('sph-simulator renders physics passes and GitHub repository link', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/sph-simulator/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="sph-simulator" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('src="/portfolio/projects/sph-simulator/sph-poster.png"');
      expect(html).toContain('src="/portfolio/projects/sph-simulator/sph.gif"');
      expect(html).toContain('Density pass');
      expect(html).toContain('Force pass');
      expect(html).toContain('Integration pass');
      expect(html).toContain('href="https://github.com/BoonyakornTanrattanakorn/SmoothedParticleHydrodynamics"');
    });

    it('thamroi renders full-stack sections, figures, and technical skills table', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/thamroi/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="thamroi" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('src="/portfolio/projects/thamroi/admin-dashboard.gif"');
      expect(html).toContain('src="/portfolio/projects/thamroi/postmanapi.png"');
      expect(html).toContain('Technical Skills Demonstrated');
      expect(html).toContain('Agile / Scrum');
    });

    it('automated-measuring-equipment renders model-viewer and sensor table', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/automated-measuring-equipment/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="automated-measuring-equipment" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('src="/portfolio/projects/automated-measuring-equipment/ame.glb"');
      expect(html).toContain('BMI160');
      expect(html).toContain('BMP280');
      expect(html).toContain('INA226');
    });

    it('cursr-iv renders model-viewer, hardware specs, and LINE Today link', () => {
      const meta = JSON.parse(
        fs.readFileSync(path.join(contentDir, 'projects/cursr-iv/meta.json'), 'utf8')
      );
      const html = renderToString(
        <ThemeProvider>
          <ProjectDetailPage slug="cursr-iv" {...meta} base="/portfolio/" />
        </ThemeProvider>
      );
      expect(html).toContain('src="/portfolio/projects/cursr-iv/FC.glb"');
      expect(html).toContain('STM32F4 microcontroller');
      expect(html).toContain('https://today.line.me/th/v3/article/yz9yZz1');
    });
  });
});

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import HomePage from '../site/src/pages/HomePage.jsx';
import ProfilePage from '../site/src/pages/ProfilePage.jsx';
import { ThemeProvider } from '../site/src/theme/ThemeContext.jsx';
import { PROFILE } from '../site/content/profile.js';

describe('About and Profile Pages', () => {
  it('renders HomePage with build-time skills, avatar, and contact links', () => {
    const mockSkills = [
      { tag: 'STM32', count: 5 },
      { tag: 'C++', count: 3 },
      { tag: 'Embedded', count: 3 },
    ];
    const html = renderToString(
      <ThemeProvider>
        <HomePage skills={mockSkills} projectCount={9} base="/portfolio/" />
      </ThemeProvider>
    );

    // Avatar
    expect(html).toContain('src="/portfolio/assets/avatar.jpg"');
    expect(html).toContain(`alt="${PROFILE.name}"`);

    // Hero title and lead
    expect(html).toContain(PROFILE.name);
    expect(html).toContain('Embedded Systems &amp; FPGA · Full-Stack');

    // Call to action buttons
    expect(html).toContain('href="/portfolio/projects.html"');
    expect(html).toContain('href="/portfolio/cv.html"');

    // Build-time skills
    expect(html).toContain('Used across <!-- -->9<!-- --> projects');
    expect(html).toContain('class="tag">STM32</span>');
    expect(html).toContain('class="tag">C++</span>');
    expect(html).toContain('class="tag">Embedded</span>');

    // Contact links
    expect(html).toContain(`href="mailto:${PROFILE.email}"`);
    expect(html).toContain(`href="${PROFILE.social.github}"`);
    expect(html).toContain(`href="${PROFILE.social.linkedin}"`);
  });

  it('renders ProfilePage with biography, highlights, and CV download link', () => {
    const html = renderToString(
      <ThemeProvider>
        <ProfilePage base="/portfolio/" />
      </ThemeProvider>
    );

    // Avatar and header
    expect(html).toContain('src="/portfolio/assets/avatar.jpg"');
    expect(html).toContain(PROFILE.subtitle);

    // Bio
    expect(html).toContain('embedded firmware engineer and student focusing on STM32/ESP32 firmware');

    // Contact info
    expect(html).toContain(PROFILE.email);
    expect(html).toContain(PROFILE.location);

    // PDF link
    expect(html).toContain('href="/portfolio/CV/Boonyakorn_Tanrattanakorn_CV.pdf"');

    // Highlights
    for (const h of PROFILE.highlights) {
      expect(html).toContain(h);
    }
  });
});

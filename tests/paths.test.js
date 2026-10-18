import { describe, it, expect } from 'vitest';
import { normalizeBasePath, withBase, isExternalUrl } from '../site/src/utils/paths.js';

describe('paths utility', () => {
  it('normalizes base paths consistently', () => {
    expect(normalizeBasePath('')).toBe('/');
    expect(normalizeBasePath('/')).toBe('/');
    expect(normalizeBasePath('portfolio')).toBe('/portfolio/');
    expect(normalizeBasePath('/portfolio')).toBe('/portfolio/');
    expect(normalizeBasePath('/portfolio/')).toBe('/portfolio/');
  });

  it('prefixes internal paths with the given base', () => {
    expect(withBase('index.html', '/')).toBe('/index.html');
    expect(withBase('/index.html', '/')).toBe('/index.html');
    expect(withBase('index.html', '/portfolio/')).toBe('/portfolio/index.html');
    expect(withBase('/profile.html', '/portfolio')).toBe('/portfolio/profile.html');
    expect(withBase('projects/cursr-iv/index.html', '/portfolio/')).toBe('/portfolio/projects/cursr-iv/index.html');
  });

  it('preserves external and hash links untouched', () => {
    expect(withBase('https://github.com', '/portfolio/')).toBe('https://github.com');
    expect(withBase('http://example.com', '/portfolio/')).toBe('http://example.com');
    expect(withBase('mailto:test@example.com', '/portfolio/')).toBe('mailto:test@example.com');
    expect(withBase('#top', '/portfolio/')).toBe('#top');
  });

  it('identifies external URLs accurately', () => {
    expect(isExternalUrl('https://example.com')).toBe(true);
    expect(isExternalUrl('http://example.com')).toBe(true);
    expect(isExternalUrl('mailto:me@example.com')).toBe(true);
    expect(isExternalUrl('/projects.html')).toBe(false);
    expect(isExternalUrl('projects.html')).toBe(false);
  });
});

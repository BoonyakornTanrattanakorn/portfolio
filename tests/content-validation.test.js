import { describe, it, expect } from 'vitest';
import { validateMetadataRecord, validateAllContent } from '../site/src/content/validate.js';

describe('Metadata validation', () => {
  it('validates a valid project record with empty thumbnail', () => {
    const validProject = {
      title: 'Valid Project',
      role: 'Lead',
      date: '2026',
      organization: 'Org',
      tags: ['C++', 'STM32'],
      summary: 'A short summary.',
      thumbnail: '',
    };
    const errors = validateMetadataRecord(validProject, { isWebsite: false });
    expect(errors).toEqual([]);
  });

  it('detects missing required fields in project metadata', () => {
    const incomplete = {
      title: 'No Role or Date',
      organization: 'Org',
      tags: ['STM32'],
      summary: 'Summary',
    };
    const errors = validateMetadataRecord(incomplete, { isWebsite: false });
    expect(errors.some((e) => e.includes('role'))).toBe(true);
    expect(errors.some((e) => e.includes('date'))).toBe(true);
  });

  it('detects invalid tags in metadata', () => {
    const invalidTags = {
      title: 'Project',
      role: 'Role',
      date: '2026',
      organization: 'Org',
      tags: 'not-an-array',
      summary: 'Summary',
    };
    const errors = validateMetadataRecord(invalidTags, { isWebsite: false });
    expect(errors.some((e) => e.includes('"tags" must be an array'))).toBe(true);
  });

  it('detects invalid website status and malformed URL', () => {
    const badWebsite = {
      title: 'Site',
      role: 'Dev',
      date: '2026',
      organization: 'Org',
      tags: ['JS'],
      summary: 'Summary',
      url: 'not-a-valid-url',
      status: 'pending-approval',
    };
    const errors = validateMetadataRecord(badWebsite, { isWebsite: true });
    expect(errors.some((e) => e.includes('status'))).toBe(true);
    expect(errors.some((e) => e.includes('URL'))).toBe(true);
  });

  it('detects missing referenced thumbnail files', () => {
    const missingThumb = {
      title: 'Project',
      role: 'Role',
      date: '2026',
      organization: 'Org',
      tags: ['STM32'],
      summary: 'Summary',
      thumbnail: 'non_existent_image_12345.jpg',
    };
    const errors = validateMetadataRecord(missingThumb, {
      isWebsite: false,
      mediaDir: 'site/projects/cursr-iv',
    });
    expect(errors.some((e) => e.includes('Referenced thumbnail file does not exist'))).toBe(true);
  });

  it('validates the actual repository content cleanly', () => {
    const result = validateAllContent({ rootDir: process.cwd() });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.counts.projects).toBe(9);
    expect(result.counts.websites).toBe(2);
  });
});

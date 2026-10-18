import { describe, it, expect } from 'vitest';
import { parseDateValue, compareDates } from '../site/src/utils/date.js';

describe('date utilities', () => {
  it('parses 4-digit year strings into UTC timestamps', () => {
    const timestamp2026 = parseDateValue('2026');
    const timestamp2024 = parseDateValue('2024');
    expect(timestamp2026).toBe(Date.UTC(2026, 0, 1));
    expect(timestamp2024).toBe(Date.UTC(2024, 0, 1));
    expect(timestamp2026).toBeGreaterThan(timestamp2024);
  });

  it('handles invalid or empty inputs gracefully without throwing', () => {
    expect(parseDateValue('')).toBe(0);
    expect(parseDateValue(null)).toBe(0);
    expect(parseDateValue(undefined)).toBe(0);
    expect(parseDateValue('invalid-date')).toBe(0);
  });

  it('orders newest first and oldest first correctly', () => {
    expect(compareDates('2026', '2024', 0, 1, 'newest')).toBeLessThan(0);
    expect(compareDates('2026', '2024', 0, 1, 'oldest')).toBeGreaterThan(0);
  });

  it('preserves manifest order stably for equal dates', () => {
    // Both 2026, original indices 2 and 5
    expect(compareDates('2026', '2026', 2, 5, 'newest')).toBeLessThan(0);
    expect(compareDates('2026', '2026', 5, 2, 'newest')).toBeGreaterThan(0);
  });
});

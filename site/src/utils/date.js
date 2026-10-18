/**
 * Pure date normalization and comparison utilities.
 * Handles year strings (e.g., '2026') and date strings deterministically.
 */
export function parseDateValue(dateInput) {
  if (!dateInput) return 0;
  const str = String(dateInput).trim();
  // If 4-digit year
  if (/^\d{4}$/.test(str)) {
    const year = parseInt(str, 10);
    return Date.UTC(year, 0, 1);
  }
  const parsed = Date.parse(str);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Compare two items by date with tie-breaker index.
 * @param {'newest' | 'oldest'} direction
 */
export function compareDates(aDate, bDate, aIndex = 0, bIndex = 0, direction = 'newest') {
  const da = parseDateValue(aDate);
  const db = parseDateValue(bDate);
  if (da !== db) {
    return direction === 'oldest' ? da - db : db - da;
  }
  // Stable tie-breaker using original order
  return aIndex - bIndex;
}

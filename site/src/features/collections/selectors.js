import { compareDates } from '../../utils/date.js';

export function normalizeText(s) {
  return String(s || '').toLowerCase().trim();
}

/**
 * Checks if an item matches a search query.
 * Matches against title, summary, organization, role, and tags.
 */
export function matchesQuery(item, query) {
  if (!query) return true;
  const q = normalizeText(query);
  if (!q) return true;

  if (normalizeText(item.title).includes(q)) return true;
  if (normalizeText(item.summary).includes(q)) return true;
  if (normalizeText(item.organization).includes(q)) return true;
  if (normalizeText(item.role).includes(q)) return true;

  const tags = Array.isArray(item.tags) ? item.tags : [];
  for (const tag of tags) {
    if (normalizeText(tag).includes(q)) return true;
  }
  return false;
}

/**
 * Filter items by search query (pure function, returns new array).
 */
export function filterBySearch(items = [], query = '') {
  if (!query) return [...items];
  return items.filter((item) => matchesQuery(item, query));
}

/**
 * Filter items by tags using OR semantics (pure function, returns new array).
 * An item matches if it has at least one of the selected tags.
 */
export function filterByTags(items = [], selectedTags = []) {
  const tagSet =
    selectedTags instanceof Set
      ? selectedTags
      : new Set(Array.isArray(selectedTags) ? selectedTags : []);

  if (tagSet.size === 0) return [...items];

  return items.filter((item) => {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    return tags.some((tag) => tagSet.has(tag));
  });
}

/**
 * Sort items deterministically without mutating source array.
 * Supports: 'newest' | 'oldest' | 'az' | 'za'.
 * Equal dates/titles preserve manifest order as tie-breaker.
 */
export function sortItems(items = [], sortMode = 'newest') {
  const indexed = items.map((item, originalIndex) => ({ item, originalIndex }));

  indexed.sort((a, b) => {
    if (sortMode === 'az') {
      const cmp = String(a.item.title || '').localeCompare(String(b.item.title || ''));
      return cmp !== 0 ? cmp : a.originalIndex - b.originalIndex;
    }
    if (sortMode === 'za') {
      const cmp = String(b.item.title || '').localeCompare(String(a.item.title || ''));
      return cmp !== 0 ? cmp : a.originalIndex - b.originalIndex;
    }
    return compareDates(
      a.item.date,
      b.item.date,
      a.originalIndex,
      b.originalIndex,
      sortMode === 'oldest' ? 'oldest' : 'newest'
    );
  });

  return indexed.map((entry) => entry.item);
}

/**
 * Combined filter and sort selector.
 */
export function selectCollectionItems(items = [], { query = '', selectedTags = [], sortMode = 'newest' } = {}) {
  const searchFiltered = filterBySearch(items, query);
  const tagFiltered = filterByTags(searchFiltered, selectedTags);
  return sortItems(tagFiltered, sortMode);
}

/**
 * Extract unique sorted tags across items.
 */
export function extractUniqueTags(items = []) {
  const set = new Set();
  for (const item of items) {
    if (Array.isArray(item.tags)) {
      for (const t of item.tags) {
        if (t) set.add(t);
      }
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/**
 * Aggregates skill tags across projects.
 * Ordered by descending project count, then alphabetically ascending.
 * Returns array of { tag, count }.
 */
export function aggregateSkills(projects = []) {
  const counts = new Map();
  for (const project of projects) {
    const tags = Array.isArray(project.tags) ? project.tags : [];
    for (const tag of tags) {
      if (tag) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

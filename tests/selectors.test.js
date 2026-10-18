import { describe, it, expect } from 'vitest';
import {
  matchesQuery,
  filterBySearch,
  filterByTags,
  sortItems,
  extractUniqueTags,
  aggregateSkills,
  selectCollectionItems,
} from '../site/src/features/collections/selectors.js';

const SAMPLE_ITEMS = [
  {
    id: 'p1',
    title: 'Alpha Rocket Flight Computer',
    summary: 'Avionics and telemetry system.',
    organization: 'CUHAR',
    role: 'Lead Designer',
    date: '2026',
    tags: ['STM32', 'LoRa', 'PCB'],
  },
  {
    id: 'p2',
    title: 'Beta Engine Ignition Unit',
    summary: 'Pyrotechnic ignition stand controller.',
    organization: 'XSRT',
    role: 'Hardware Engineer',
    date: '2026',
    tags: ['KiCad', 'CAN Bus', 'STM32'],
  },
  {
    id: 'p3',
    title: 'Gamma FPGA Display System',
    summary: 'Real-time video rendering on VGA monitor.',
    organization: 'Academic Project',
    role: 'RTL Developer',
    date: '2025',
    tags: ['Verilog', 'VGA', 'FPGA'],
  },
  {
    id: 'p4',
    title: 'Delta Fluid Simulator',
    summary: 'Smoothed particle hydrodynamics solver.',
    organization: 'Personal Project',
    role: 'Graphics Developer',
    date: '2024',
    tags: ['Godot', 'GLSL', 'Simulation'],
  },
];

describe('Collection Selectors & Logic', () => {
  describe('Search functionality', () => {
    it('matches case-insensitively across title, summary, organization, role, and tags', () => {
      // Title match
      expect(matchesQuery(SAMPLE_ITEMS[0], 'rocket')).toBe(true);
      expect(matchesQuery(SAMPLE_ITEMS[0], 'ROCKET')).toBe(true);

      // Summary match
      expect(matchesQuery(SAMPLE_ITEMS[1], 'pyrotechnic')).toBe(true);

      // Organization match
      expect(matchesQuery(SAMPLE_ITEMS[0], 'cuhar')).toBe(true);

      // Role match
      expect(matchesQuery(SAMPLE_ITEMS[2], 'rtl developer')).toBe(true);

      // Tag match
      expect(matchesQuery(SAMPLE_ITEMS[3], 'glsl')).toBe(true);

      // Non-match
      expect(matchesQuery(SAMPLE_ITEMS[0], 'quantum-computing')).toBe(false);
    });

    it('filterBySearch returns matching items and does not mutate source', () => {
      const copy = [...SAMPLE_ITEMS];
      const result = filterBySearch(SAMPLE_ITEMS, 'stm32');
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.id)).toEqual(['p1', 'p2']);
      expect(SAMPLE_ITEMS).toEqual(copy);
    });
  });

  describe('Tag filtering (OR semantics)', () => {
    it('returns all items when no tags are selected', () => {
      expect(filterByTags(SAMPLE_ITEMS, [])).toHaveLength(SAMPLE_ITEMS.length);
      expect(filterByTags(SAMPLE_ITEMS, new Set())).toHaveLength(SAMPLE_ITEMS.length);
    });

    it('filters by single tag', () => {
      const result = filterByTags(SAMPLE_ITEMS, ['STM32']);
      expect(result.map((i) => i.id)).toEqual(['p1', 'p2']);
    });

    it('filters by multiple tags using OR semantics', () => {
      const result = filterByTags(SAMPLE_ITEMS, ['CAN Bus', 'Verilog']);
      expect(result.map((i) => i.id)).toEqual(['p2', 'p3']);
    });

    it('supports Set input and handles missing/empty tags gracefully', () => {
      const set = new Set(['Simulation']);
      const result = filterByTags(SAMPLE_ITEMS, set);
      expect(result.map((i) => i.id)).toEqual(['p4']);

      const itemWithoutTags = [{ id: 'empty', title: 'T' }];
      expect(filterByTags(itemWithoutTags, ['STM32'])).toEqual([]);
    });
  });

  describe('Sorting and stability', () => {
    it('sorts by newest with manifest tie-breaker for equal dates', () => {
      const sorted = sortItems(SAMPLE_ITEMS, 'newest');
      expect(sorted.map((i) => i.id)).toEqual(['p1', 'p2', 'p3', 'p4']);
    });

    it('sorts by oldest with manifest tie-breaker', () => {
      const sorted = sortItems(SAMPLE_ITEMS, 'oldest');
      expect(sorted.map((i) => i.id)).toEqual(['p4', 'p3', 'p1', 'p2']);
    });

    it('sorts alphabetically A-Z and Z-A', () => {
      const az = sortItems(SAMPLE_ITEMS, 'az');
      expect(az.map((i) => i.id)).toEqual(['p1', 'p2', 'p4', 'p3']);

      const za = sortItems(SAMPLE_ITEMS, 'za');
      expect(za.map((i) => i.id)).toEqual(['p3', 'p4', 'p2', 'p1']);
    });

    it('does not mutate original items array during sorting', () => {
      const originalIds = SAMPLE_ITEMS.map((i) => i.id);
      sortItems(SAMPLE_ITEMS, 'oldest');
      expect(SAMPLE_ITEMS.map((i) => i.id)).toEqual(originalIds);
    });
  });

  describe('Skill aggregation and tag extraction', () => {
    it('extracts unique sorted tags', () => {
      const tags = extractUniqueTags(SAMPLE_ITEMS);
      expect(tags).toEqual([
        'CAN Bus',
        'FPGA',
        'GLSL',
        'Godot',
        'KiCad',
        'LoRa',
        'PCB',
        'Simulation',
        'STM32',
        'Verilog',
        'VGA',
      ]);
    });

    it('aggregates skill frequency ordered by count descending, then alphabetically ascending', () => {
      const skills = aggregateSkills(SAMPLE_ITEMS);
      expect(skills[0]).toEqual({ tag: 'STM32', count: 2 });
      // Count 1 skills should be alphabetical
      const count1 = skills.slice(1);
      expect(count1.every((s) => s.count === 1)).toBe(true);
      const count1Tags = count1.map((s) => s.tag);
      const sortedTags = [...count1Tags].sort((a, b) => a.localeCompare(b));
      expect(count1Tags).toEqual(sortedTags);
    });

    it('selectCollectionItems combines search, tag filter, and sort cleanly', () => {
      const result = selectCollectionItems(SAMPLE_ITEMS, {
        query: 'CUHAR',
        selectedTags: ['STM32'],
        sortMode: 'newest',
      });
      expect(result.map((i) => i.id)).toEqual(['p1']);
    });
  });
});

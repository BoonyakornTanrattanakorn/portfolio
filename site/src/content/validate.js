import fs from 'node:fs';
import path from 'node:path';

export const VALID_WEBSITE_STATUSES = ['live', 'wip', 'archived'];

export function validateMetadataRecord(item, { isWebsite = false, mediaDir } = {}) {
  const errors = [];

  if (!item || typeof item !== 'object') {
    return ['Item metadata must be an object'];
  }

  // Common required string fields
  const requiredFields = ['title', 'role', 'date', 'organization', 'summary'];
  for (const field of requiredFields) {
    if (!item[field] || typeof item[field] !== 'string' || item[field].trim() === '') {
      errors.push(`Missing or empty required string field "${field}"`);
    }
  }

  // Tags
  if (!Array.isArray(item.tags)) {
    errors.push('Field "tags" must be an array');
  } else {
    for (const tag of item.tags) {
      if (typeof tag !== 'string' || tag.trim() === '') {
        errors.push(`Invalid tag entry: "${tag}". Tags must be non-empty strings.`);
      }
    }
  }

  // Website-specific checks
  if (isWebsite) {
    if (!item.url || typeof item.url !== 'string') {
      errors.push('Website missing required field "url"');
    } else {
      try {
        const parsed = new URL(item.url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          errors.push(`Invalid website URL protocol: "${item.url}". Must be http or https.`);
        }
      } catch (e) {
        errors.push(`Malformed website URL: "${item.url}" (${e.message})`);
      }
    }

    if (!item.status || !VALID_WEBSITE_STATUSES.includes(String(item.status).toLowerCase())) {
      errors.push(
        `Invalid website status: "${item.status}". Allowed values: ${VALID_WEBSITE_STATUSES.join(', ')}`
      );
    }
  }

  // Thumbnail check (allow intentionally empty strings)
  if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.trim() !== '') {
    if (mediaDir) {
      const thumbPath = path.join(mediaDir, item.thumbnail.trim());
      if (!fs.existsSync(thumbPath)) {
        errors.push(`Referenced thumbnail file does not exist: "${thumbPath}"`);
      }
    }
  }

  return errors;
}

export function validateAllContent({ rootDir = process.cwd() } = {}) {
  const errors = [];
  const contentDir = path.join(rootDir, 'site', 'content');
  const projectsManifestPath = path.join(contentDir, 'projects.json');
  const websitesManifestPath = path.join(contentDir, 'websites.json');

  if (!fs.existsSync(projectsManifestPath)) {
    return { valid: false, errors: [`Missing projects manifest: ${projectsManifestPath}`] };
  }
  if (!fs.existsSync(websitesManifestPath)) {
    return { valid: false, errors: [`Missing websites manifest: ${websitesManifestPath}`] };
  }

  const projects = JSON.parse(fs.readFileSync(projectsManifestPath, 'utf8'));
  const websites = JSON.parse(fs.readFileSync(websitesManifestPath, 'utf8'));

  if (!Array.isArray(projects) || projects.length === 0) {
    errors.push('Projects manifest must be a non-empty array of slugs');
  }
  if (!Array.isArray(websites) || websites.length === 0) {
    errors.push('Websites manifest must be a non-empty array of IDs');
  }

  // Check unique IDs across both collections
  const seenIds = new Set();
  for (const slug of projects) {
    if (seenIds.has(slug)) {
      errors.push(`Duplicate ID detected: "${slug}"`);
    }
    seenIds.add(slug);

    const metaPath = path.join(contentDir, 'projects', slug, 'meta.json');
    if (!fs.existsSync(metaPath)) {
      errors.push(`Missing project meta.json for "${slug}" at ${metaPath}`);
      continue;
    }
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const mediaDir = path.join(rootDir, 'site', 'projects', slug);
      const recordErrors = validateMetadataRecord(meta, { isWebsite: false, mediaDir });
      for (const err of recordErrors) {
        errors.push(`Project "${slug}": ${err}`);
      }
    } catch (e) {
      errors.push(`Project "${slug}" has malformed JSON: ${e.message}`);
    }
  }

  for (const id of websites) {
    if (seenIds.has(id)) {
      errors.push(`Duplicate ID detected: "${id}"`);
    }
    seenIds.add(id);

    const metaPath = path.join(contentDir, 'websites', id, 'meta.json');
    if (!fs.existsSync(metaPath)) {
      errors.push(`Missing website meta.json for "${id}" at ${metaPath}`);
      continue;
    }
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const mediaDir = path.join(rootDir, 'site', 'websites', id);
      const recordErrors = validateMetadataRecord(meta, { isWebsite: true, mediaDir });
      for (const err of recordErrors) {
        errors.push(`Website "${id}": ${err}`);
      }
    } catch (e) {
      errors.push(`Website "${id}" has malformed JSON: ${e.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    counts: {
      projects: projects.length,
      websites: websites.length,
    },
  };
}

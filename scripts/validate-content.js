import fs from 'node:fs';
import path from 'node:path';

function validateContent() {
  const root = process.cwd();
  const projectsManifest = path.join(root, 'site', 'projects', 'projects.json');
  const websitesManifest = path.join(root, 'site', 'websites', 'websites.json');

  if (!fs.existsSync(projectsManifest)) {
    throw new Error(`Missing projects manifest: ${projectsManifest}`);
  }
  if (!fs.existsSync(websitesManifest)) {
    throw new Error(`Missing websites manifest: ${websitesManifest}`);
  }

  const projects = JSON.parse(fs.readFileSync(projectsManifest, 'utf8'));
  const websites = JSON.parse(fs.readFileSync(websitesManifest, 'utf8'));

  if (!Array.isArray(projects) || projects.length === 0) {
    throw new Error('Projects manifest must be a non-empty array');
  }
  if (!Array.isArray(websites) || websites.length === 0) {
    throw new Error('Websites manifest must be a non-empty array');
  }

  console.log(`Content validation passed: ${projects.length} projects, ${websites.length} websites.`);
}

try {
  validateContent();
} catch (error) {
  console.error(`Content validation failed: ${error.message}`);
  process.exit(1);
}

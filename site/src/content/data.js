import projectsManifest from '../../content/projects.json';
import websitesManifest from '../../content/websites.json';
import { aggregateSkills } from '../features/collections/selectors.js';

import ameMeta from '../../content/projects/automated-measuring-equipment/meta.json';
import cursrMeta from '../../content/projects/cursr-iv/meta.json';
import ematchMeta from '../../content/projects/ematch-ignition-module/meta.json';
import internshipMeta from '../../content/projects/engineering-internship/meta.json';
import fpgaMeta from '../../content/projects/fpga-video-player/meta.json';
import sphMeta from '../../content/projects/sph-simulator/meta.json';
import thamroiMeta from '../../content/projects/thamroi/meta.json';
import weatherMeta from '../../content/projects/weather-station/meta.json';
import xsrtMeta from '../../content/projects/xsrt-rocket-test-bench/meta.json';

import accMeta from '../../content/websites/ACC26FlightDataVisualization/meta.json';
import bandMeta from '../../content/websites/BandResistorColorCodeCalculator/meta.json';

export const PROJECT_METAS = {
  'automated-measuring-equipment': ameMeta,
  'cursr-iv': cursrMeta,
  'ematch-ignition-module': ematchMeta,
  'engineering-internship': internshipMeta,
  'fpga-video-player': fpgaMeta,
  'sph-simulator': sphMeta,
  thamroi: thamroiMeta,
  'weather-station': weatherMeta,
  'xsrt-rocket-test-bench': xsrtMeta,
};

export const WEBSITE_METAS = {
  ACC26FlightDataVisualization: accMeta,
  BandResistorColorCodeCalculator: bandMeta,
};

export const ALL_PROJECTS = projectsManifest.map((slug) => ({
  slug,
  ...(PROJECT_METAS[slug] || {}),
}));

export const ALL_WEBSITES = websitesManifest.map((id) => ({
  id,
  ...(WEBSITE_METAS[id] || {}),
}));

export const ALL_SKILLS = aggregateSkills(ALL_PROJECTS);

export function resolveRouteFromPath(pathname = '/', base = '/') {
  let cleanPath = pathname || '/';

  // Normalize base
  const normBase = base.endsWith('/') ? base : base + '/';
  if (cleanPath.startsWith(normBase)) {
    cleanPath = '/' + cleanPath.slice(normBase.length);
  } else if (cleanPath.startsWith('/portfolio/')) {
    cleanPath = '/' + cleanPath.slice('/portfolio/'.length);
  }

  // Normalize leading slash and strip trailing slash except for root
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Check static main routes
  if (cleanPath === '/' || cleanPath === '/index.html') {
    return {
      componentKey: 'home',
      props: { skills: ALL_SKILLS, projectCount: ALL_PROJECTS.length },
    };
  }
  if (cleanPath === '/profile.html' || cleanPath === '/profile') {
    return { componentKey: 'profile', props: {} };
  }
  if (cleanPath === '/projects.html' || cleanPath === '/projects') {
    return { componentKey: 'projects', props: { projects: ALL_PROJECTS } };
  }
  if (cleanPath === '/websites.html' || cleanPath === '/websites') {
    return { componentKey: 'websites', props: { websites: ALL_WEBSITES } };
  }
  if (cleanPath === '/cv.html' || cleanPath === '/cv') {
    return { componentKey: 'cv', props: {} };
  }
  if (cleanPath === '/404.html') {
    return { componentKey: '404', props: {} };
  }

  // Check project detail: /projects/<slug> or /projects/<slug>/index.html
  const projectMatch = cleanPath.match(/^\/projects\/([^/]+)(?:\/index\.html)?$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    if (PROJECT_METAS[slug]) {
      return {
        componentKey: 'project-detail',
        props: { slug, ...PROJECT_METAS[slug] },
      };
    }
  }

  return { componentKey: '404', props: {} };
}

export function getPageTitle(componentKey, props = {}) {
  switch (componentKey) {
    case 'home':
      return 'Boonyakorn Tanrattanakorn — Computer Engineering Portfolio';
    case 'profile':
      return 'Profile — Boonyakorn Tanrattanakorn';
    case 'projects':
      return 'Portfolio — Boonyakorn Tanrattanakorn';
    case 'websites':
      return 'Websites — Boonyakorn Tanrattanakorn';
    case 'cv':
      return 'CV — Boonyakorn Tanrattanakorn';
    case 'project-detail':
      return `${props.title || props.slug || 'Project'} — Project`;
    case '404':
    default:
      return 'Page Not Found — Boonyakorn Tanrattanakorn';
  }
}

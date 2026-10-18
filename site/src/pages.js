/**
 * Shared page definitions and route output paths.
 * Pure JavaScript with no JSX dependencies so it can be imported in Node scripts,
 * Vite bundles, and tests.
 */

export const MAIN_PAGES = [
  {
    id: 'home',
    outputPath: 'index.html',
    title: 'Boonyakorn Tanrattanakorn — Computer Engineering Portfolio',
    description:
      'Boonyakorn Tanrattanakorn — Computer Engineering student at Chulalongkorn University. Embedded systems, FPGA, and full-stack projects, plus CV.',
    componentKey: 'home',
    props: {},
  },
  {
    id: 'profile',
    outputPath: 'profile.html',
    title: 'Profile — Boonyakorn Tanrattanakorn',
    description:
      'Profile of Boonyakorn Tanrattanakorn — embedded firmware (STM32/ESP32), FPGA design, and systems engineering.',
    componentKey: 'profile',
    props: {},
  },
  {
    id: 'projects',
    outputPath: 'projects.html',
    title: 'Portfolio — Boonyakorn Tanrattanakorn',
    description:
      'Selected engineering projects by Boonyakorn Tanrattanakorn — embedded systems, FPGA, simulation, and full-stack web.',
    componentKey: 'projects',
    props: {},
  },
  {
    id: 'websites',
    outputPath: 'websites.html',
    title: 'Websites — Boonyakorn Tanrattanakorn',
    description:
      'Websites built by Boonyakorn Tanrattanakorn — live full-stack and front-end web applications.',
    componentKey: 'websites',
    props: {},
  },
  {
    id: 'cv',
    outputPath: 'cv.html',
    title: 'CV — Boonyakorn Tanrattanakorn',
    description:
      'Curriculum vitae of Boonyakorn Tanrattanakorn, Computer Engineering student at Chulalongkorn University.',
    componentKey: 'cv',
    props: {},
  },
  {
    id: '404',
    outputPath: '404.html',
    title: 'Page Not Found — Boonyakorn Tanrattanakorn',
    description: 'The requested page could not be found.',
    componentKey: '404',
    props: {},
  },
];

export function getProjectPages(projectsList = []) {
  return projectsList.map((project) => {
    const slug = typeof project === 'string' ? project : project.id || project.slug;
    const title = project.title || slug;
    const summary = project.summary || '';
    const date = project.date || '';
    const organization = project.organization || '';
    const role = project.role || '';
    const tags = Array.isArray(project.tags) ? project.tags : [];
    const thumbnail = project.thumbnail || '';
    return {
      id: `project:${slug}`,
      outputPath: `projects/${slug}/index.html`,
      title: `${title} — Project`,
      description: summary || `${title} case study`,
      componentKey: 'project-detail',
      props: {
        slug,
        title,
        summary,
        date,
        organization,
        role,
        tags,
        thumbnail,
      },
    };
  });
}

import AppLayout from '../components/AppLayout.jsx';
import CollectionGrid from '../features/collections/CollectionGrid.jsx';
import { withBase } from '../utils/paths.js';

export default function ProjectsPage({ projects = [], base = '/', error = null }) {
  return (
    <AppLayout currentNav="projects" base={base}>
      <section>
        <h1 style={{ margin: '8px 0 4px' }}>Portfolio</h1>
        <p className="lead">Selected projects and highlights. Click a card to read more.</p>
      </section>

      <CollectionGrid
        items={projects}
        noun="projects"
        isExternal={false}
        cardHref={(id) => withBase(`projects/${id}/index.html`, base)}
        mediaBase="projects/"
        base={base}
        error={error}
      />
    </AppLayout>
  );
}

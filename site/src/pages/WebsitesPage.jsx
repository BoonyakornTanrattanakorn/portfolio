import AppLayout from '../components/AppLayout.jsx';
import CollectionGrid from '../features/collections/CollectionGrid.jsx';

export default function WebsitesPage({ websites = [], base = '/', error = null }) {
  return (
    <AppLayout currentNav="websites" base={base}>
      <section>
        <h1 style={{ margin: '8px 0 4px' }}>Websites</h1>
        <p className="lead">Sites I&apos;ve built. Clicking a card opens the live site in a new tab.</p>
      </section>

      <CollectionGrid
        items={websites}
        noun="websites"
        isExternal={true}
        cardHref={(_id, item) => item.url || '#'}
        mediaBase="websites/"
        base={base}
        error={error}
      />
    </AppLayout>
  );
}

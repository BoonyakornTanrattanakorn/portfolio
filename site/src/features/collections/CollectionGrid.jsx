import { useState, useMemo } from 'react';
import CollectionControls from './CollectionControls.jsx';
import Card from './Card.jsx';
import {
  selectCollectionItems,
  extractUniqueTags,
} from './selectors.js';

export default function CollectionGrid({
  items = [],
  noun = 'items',
  isExternal = false,
  cardHref,
  mediaBase = '',
  base = '/',
  error = null,
}) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortMode, setSortMode] = useState('newest');

  const validItems = useMemo(
    () => (Array.isArray(items) ? items.filter((item) => item && !item.error) : []),
    [items]
  );
  const itemErrors = useMemo(
    () => (Array.isArray(items) ? items.filter((item) => item && item.error) : []),
    [items]
  );

  const allTags = useMemo(() => extractUniqueTags(validItems), [validItems]);

  const visibleItems = useMemo(
    () => selectCollectionItems(validItems, { query, selectedTags, sortMode }),
    [validItems, query, selectedTags, sortMode]
  );

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <CollectionControls
        noun={noun}
        query={query}
        onQueryChange={setQuery}
        sortMode={sortMode}
        onSortChange={setSortMode}
        allTags={allTags}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        totalResults={visibleItems.length}
        hasError={Boolean(error || (validItems.length === 0 && itemErrors.length > 0))}
      />

      {error && (
        <p className="error-msg" role="alert">
          {`Failed to load ${noun}: ${error}`}
        </p>
      )}

      {itemErrors.length > 0 && (
        <div className="collection-errors" role="alert">
          {itemErrors.map((err) => (
            <p key={err.id || err.slug} className="error-msg">
              {`Could not load "${err.id || err.slug}": ${err.error}`}
            </p>
          ))}
        </div>
      )}

      {!error && (
        <section className="grid" id="project-grid">
          {visibleItems.length === 0 ? (
            itemErrors.length === 0 ? (
              <p className="loading">No {noun} found.</p>
            ) : null
          ) : (
            visibleItems.map((item) => {
              const itemId = item.id || item.slug;
              return (
                <Card
                  key={itemId}
                  item={item}
                  href={cardHref ? cardHref(itemId, item) : '#'}
                  isExternal={isExternal}
                  base={base}
                  mediaBase={mediaBase}
                />
              );
            })
          )}
        </section>
      )}
    </>
  );
}

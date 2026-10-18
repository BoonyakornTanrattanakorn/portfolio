export default function CollectionControls({
  noun = 'items',
  query = '',
  onQueryChange,
  sortMode = 'newest',
  onSortChange,
  allTags = [],
  selectedTags = [],
  onToggleTag,
  totalResults = 0,
  hasError = false,
}) {
  const selectedSet = new Set(selectedTags);

  return (
    <section className="controls" aria-label={`${noun} filters and sorting`}>
      <input
        id="search"
        type="search"
        placeholder={`Search ${noun} (title, summary, tags)`}
        aria-label={`Search ${noun}`}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <label htmlFor="sort" style={{ marginLeft: '8px' }}>
        Sort:
      </label>
      <select
        id="sort"
        aria-label={`Sort ${noun}`}
        value={sortMode}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="az">Title A–Z</option>
        <option value="za">Title Z–A</option>
      </select>

      {allTags.length > 0 && (
        <div id="tag-filters" style={{ display: 'inline-block', marginLeft: '12px' }}>
          {allTags.map((tag) => {
            const isSelected = selectedSet.has(tag);
            return (
              <button
                key={tag}
                type="button"
                className={`tag-filter${isSelected ? ' active' : ''}`}
                aria-pressed={isSelected}
                data-tag={tag}
                onClick={() => onToggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Screen reader live announcement */}
      <div
        className="sr-only"
        aria-live="polite"
        role="status"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {hasError
          ? `Error loading ${noun}.`
          : totalResults === 0
          ? `No ${noun} found.`
          : `Showing ${totalResults} ${noun}.`}
      </div>
    </section>
  );
}

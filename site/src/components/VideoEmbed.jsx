export default function VideoEmbed({
  src,
  title = 'Video demonstration',
  watchUrl,
  explanatoryText,
  className = '',
}) {
  return (
    <div className={`video-embed-container${className ? ` ${className}` : ''}`}>
      <div className="video-wrapper">
        <iframe
          src={src}
          title={title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
      {explanatoryText && <p className="demo-note">{explanatoryText}</p>}
      {watchUrl && (
        <p>
          Watch on YouTube:{' '}
          <a href={watchUrl} target="_blank" rel="noopener noreferrer">
            {watchUrl}
          </a>
        </p>
      )}
    </div>
  );
}

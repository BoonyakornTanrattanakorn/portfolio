export default function ProjectFigure({ src, alt, caption, className = '' }) {
  return (
    <figure className={`inbody-figure${className ? ` ${className}` : ''}`}>
      <img className="inbody-img" src={src} alt={alt || caption || ''} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

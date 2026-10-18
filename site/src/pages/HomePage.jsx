import AppLayout from '../components/AppLayout.jsx';
import { PROFILE } from '../../content/profile.js';
import { withBase } from '../utils/paths.js';

export default function HomePage({ skills = [], projectCount = 9, base = '/' }) {
  return (
    <AppLayout currentNav="home" base={base}>
      <section className="hero">
        <img
          className="avatar"
          src={withBase(PROFILE.avatar.src, base)}
          alt={PROFILE.name}
        />
        <div>
          <h1>{PROFILE.name}</h1>
          <p className="lead">{PROFILE.headline}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={withBase('projects.html', base)}>
              View Portfolio →
            </a>
            <a className="btn btn-secondary" href={withBase('cv.html', base)}>
              Read CV
            </a>
          </div>
        </div>
      </section>

      <section className="section-block">
        <h2>About</h2>
        <p>{PROFILE.about[0]}</p>
      </section>

      <section className="section-block">
        <h2>Skills &amp; Tools</h2>
        <div className="skill-groups" id="skill-groups">
          <div className="skill-card">
            <h3>Used across {projectCount} projects</h3>
            <div className="tags">
              {skills.map(({ tag }) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <h2>Get in touch</h2>
        <p>
          Email: <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> ·{' '}
          <a
            href={PROFILE.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{' '}
          ·{' '}
          <a
            href={PROFILE.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </section>
    </AppLayout>
  );
}

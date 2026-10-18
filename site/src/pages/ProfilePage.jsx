import AppLayout from '../components/AppLayout.jsx';
import { PROFILE } from '../../content/profile.js';
import { withBase } from '../utils/paths.js';

export default function ProfilePage({ base = '/' }) {
  return (
    <AppLayout currentNav="profile" base={base}>
      <header>
        <img
          className="avatar"
          src={withBase(PROFILE.avatar.src, base)}
          alt={PROFILE.name}
        />
        <div>
          <h1>{PROFILE.name}</h1>
          <div className="lead">{PROFILE.subtitle}</div>
        </div>
      </header>

      <div className="body">
        <h2>About</h2>
        <p>{PROFILE.profileAbout}</p>

        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
        <p>Location: {PROFILE.location}</p>

        <h2>Links</h2>
        <ul>
          <li>
            <a
              href={PROFILE.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={PROFILE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={withBase(PROFILE.cv.pdf, base)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV (PDF)
            </a>
          </li>
        </ul>

        <h2>Highlights</h2>
        <ul>
          {PROFILE.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

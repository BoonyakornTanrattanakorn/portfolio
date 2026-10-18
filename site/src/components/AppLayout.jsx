import Sidebar from './Sidebar.jsx';

export default function AppLayout({ currentNav, base = '/', children }) {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar currentNav={currentNav} base={base} />
      <main id="main-content" className="app-content" tabIndex="-1">
        <div className="wrap">{children}</div>
      </main>
    </div>
  );
}

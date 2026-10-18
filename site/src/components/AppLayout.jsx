import Sidebar from './Sidebar.jsx';

export default function AppLayout({ currentNav, base = '/', children }) {
  return (
    <div className="app-layout">
      <Sidebar currentNav={currentNav} base={base} />
      <main className="app-content">
        <div className="wrap">{children}</div>
      </main>
    </div>
  );
}

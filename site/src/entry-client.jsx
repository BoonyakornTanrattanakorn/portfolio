import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.jsx';
import { resolveRouteFromPath } from './content/data.js';
import '../assets/css/styles.css';

function getInitialData() {
  const script = document.getElementById('__PORTFOLIO_DATA__');
  if (script && script.textContent) {
    try {
      const data = JSON.parse(script.textContent);
      if (data && data.componentKey) {
        return data;
      }
    } catch (e) {
      console.error('Failed to parse __PORTFOLIO_DATA__:', e);
    }
  }

  // Fallback for dev mode and dynamic client routing when pre-rendered data is absent
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const base = pathname.startsWith('/portfolio/') ? '/portfolio/' : '/';
  const resolved = resolveRouteFromPath(pathname, base);
  return {
    componentKey: resolved.componentKey,
    props: resolved.props,
    base,
  };
}

const container = document.getElementById('root');
if (container) {
  const data = getInitialData();
  const element = (
    <App
      componentKey={data.componentKey}
      props={data.props}
      base={data.base}
    />
  );
  if (container.hasChildNodes()) {
    hydrateRoot(container, element);
  } else {
    createRoot(container).render(element);
  }
}

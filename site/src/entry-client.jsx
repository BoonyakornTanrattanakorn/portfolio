import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.jsx';

function getInitialData() {
  const script = document.getElementById('__PORTFOLIO_DATA__');
  if (script && script.textContent) {
    try {
      return JSON.parse(script.textContent);
    } catch (e) {
      console.error('Failed to parse __PORTFOLIO_DATA__:', e);
    }
  }
  return { componentKey: 'home', props: {}, base: '/' };
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

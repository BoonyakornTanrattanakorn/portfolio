import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export function renderPage({ componentKey, props, base }) {
  const html = renderToString(
    <App componentKey={componentKey} props={props} base={base} />
  );
  return { html };
}

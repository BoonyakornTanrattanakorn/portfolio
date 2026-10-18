import { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import WebsitesPage from './pages/WebsitesPage.jsx';
import CvPage from './pages/CvPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { resolveRouteFromPath, getPageTitle } from './content/data.js';

export const PAGE_COMPONENTS = {
  home: HomePage,
  profile: ProfilePage,
  projects: ProjectsPage,
  websites: WebsitesPage,
  cv: CvPage,
  'project-detail': ProjectDetailPage,
  404: NotFoundPage,
};

export default function App({ componentKey: initialKey = 'home', props: initialProps = {}, base = '/' }) {
  const [currentRoute, setCurrentRoute] = useState({
    componentKey: initialKey,
    props: initialProps,
  });

  useEffect(() => {
    function handleLocationChange() {
      const resolved = resolveRouteFromPath(window.location.pathname, base);
      setCurrentRoute({
        componentKey: resolved.componentKey,
        props: resolved.props,
      });
      document.title = getPageTitle(resolved.componentKey, resolved.props);
      window.scrollTo(0, 0);
    }

    function handleLinkClick(e) {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Do not intercept external links, new tabs, downloads, or anchor jumps
      if (
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        anchor.getAttribute('rel')?.includes('external') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Check if link points to non-HTML asset
      const cleanHref = href.split('?')[0].split('#')[0];
      if (/\.(pdf|glb|png|jpg|jpeg|gif|svg|zip)$/i.test(cleanHref)) {
        return;
      }

      // Intercept and navigate via client-side routing
      e.preventDefault();
      if (window.location.pathname + window.location.search !== href) {
        window.history.pushState(null, '', href);
        handleLocationChange();
      }
    }

    window.addEventListener('popstate', handleLocationChange);
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, [base]);

  const Component = PAGE_COMPONENTS[currentRoute.componentKey] || PAGE_COMPONENTS['404'];
  return (
    <ThemeProvider>
      <div className="portfolio-app" data-component={currentRoute.componentKey}>
        <Component {...currentRoute.props} base={base} />
      </div>
    </ThemeProvider>
  );
}

import { ThemeProvider } from './theme/ThemeContext.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import WebsitesPage from './pages/WebsitesPage.jsx';
import CvPage from './pages/CvPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export const PAGE_COMPONENTS = {
  home: HomePage,
  profile: ProfilePage,
  projects: ProjectsPage,
  websites: WebsitesPage,
  cv: CvPage,
  'project-detail': ProjectDetailPage,
  404: NotFoundPage,
};

export default function App({ componentKey = 'home', props = {}, base = '/' }) {
  const Component = PAGE_COMPONENTS[componentKey] || PAGE_COMPONENTS['404'];
  return (
    <ThemeProvider>
      <div className="portfolio-app" data-component={componentKey}>
        <Component {...props} base={base} />
      </div>
    </ThemeProvider>
  );
}

import WelcomePage from './pages/WelcomePage';
import GoalSelectionPage from './pages/GoalSelectionPage';
import PreferenceConfigPage from './pages/PreferenceConfigPage';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Welcome',
    path: '/',
    element: <WelcomePage />,
  },
  {
    name: 'Goal Selection',
    path: '/goal-selection',
    element: <GoalSelectionPage />,
  },
  {
    name: 'Preferences',
    path: '/preferences',
    element: <PreferenceConfigPage />,
  },
  {
    name: 'Home',
    path: '/home',
    element: <HomePage />,
  },
  {
    name: 'Results',
    path: '/results',
    element: <ResultsPage />,
  },
];

export default routes;

import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AgeGroupProvider, useAgeGroup } from './state/AgeGroupContext';
import { GlobalErrorBoundary } from './components/errors/GlobalErrorBoundary';
import HomePage from './pages/HomePage';
import AgeSelectPage from './pages/AgeSelectPage';
import ActivitySelectPage from './pages/ActivitySelectPage';
import PlayRoundPage from './pages/play/PlayRoundPage';
import RoundSummaryPage from './pages/play/RoundSummaryPage';
import TimesTablesPage from './pages/times-tables/TimesTablesPage';
import HelpPage from './pages/HelpPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import KidLayout from './components/layout/KidLayout';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <KidLayout>
      <Outlet />
    </KidLayout>
  ),
});

// Define all routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const ageSelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/age-select',
  component: AgeSelectPage,
});

// Wrapper component for activity select with age group guard
function ActivitySelectGuard() {
  const { selectedAgeGroup } = useAgeGroup();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedAgeGroup) {
      navigate({ to: '/age-select' });
    }
  }, [selectedAgeGroup, navigate]);

  if (!selectedAgeGroup) return null;
  return <ActivitySelectPage />;
}

const activitySelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/activity-select',
  component: ActivitySelectGuard,
});

// Wrapper component for play round with age group guard
function PlayRoundGuard() {
  const { selectedAgeGroup } = useAgeGroup();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedAgeGroup) {
      navigate({ to: '/age-select' });
    }
  }, [selectedAgeGroup, navigate]);

  if (!selectedAgeGroup) return null;
  return <PlayRoundPage />;
}

const playRoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/$gameType',
  component: PlayRoundGuard,
});

const roundSummaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/round-summary',
  component: RoundSummaryPage,
});

// Wrapper component for times tables with age group guard
function TimesTablesGuard() {
  const { selectedAgeGroup } = useAgeGroup();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedAgeGroup) {
      navigate({ to: '/age-select' });
    }
  }, [selectedAgeGroup, navigate]);

  if (!selectedAgeGroup) return null;
  return <TimesTablesPage />;
}

const timesTablesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/times-tables',
  component: TimesTablesGuard,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: ProgressPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  ageSelectRoute,
  activitySelectRoute,
  playRoundRoute,
  roundSummaryRoute,
  timesTablesRoute,
  helpRoute,
  progressRoute,
  settingsRoute,
]);

// Create router
const router = createRouter({ routeTree });

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AgeGroupProvider>
        <RouterProvider router={router} />
      </AgeGroupProvider>
    </GlobalErrorBoundary>
  );
}

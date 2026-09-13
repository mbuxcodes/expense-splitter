// Route tree definition (FRONTEND_ARCHITECTURE.md Section 8). Only
// placeholder pages exist at this milestone -- feature routes (groups,
// expenses, etc.) are added per-feature, in their own milestones, nested
// under this tree rather than replacing it.
import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage.js';
import { HealthCheckPage } from '../pages/HealthCheckPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { ProtectedRoute } from './ProtectedRoute.js';
import { ROUTES } from './routeConfig.js';

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.healthCheck,
    element: <HealthCheckPage />,
  },
  {
    path: ROUTES.notFound,
    element: <NotFoundPage />,
  },
]);

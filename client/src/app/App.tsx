// Root application component: renders the router inside the provider tree.
// No business logic -- this is composition only (FRONTEND_ARCHITECTURE.md
// Section 9's page/app responsibility rule).
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers.js';
import { router } from '../routes/index.js';

export function App(): React.JSX.Element {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

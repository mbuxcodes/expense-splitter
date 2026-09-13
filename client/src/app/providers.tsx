// Application-wide provider composition, kept separate from main.tsx
// (Objective 7 / FRONTEND_ARCHITECTURE.md Section 3) so main.tsx stays a
// one-line mount and providers can be added/reordered here without touching
// the entrypoint.
import type { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store.js';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  return (
    <ReduxProvider store={store}>
      {/* Future providers (theme, toast queue, etc.) compose here as they're
          actually needed -- not scaffolded ahead of time. */}
      {children}
    </ReduxProvider>
  );
}

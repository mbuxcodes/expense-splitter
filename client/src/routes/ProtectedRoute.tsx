// Route guard placeholder. FRONTEND_ARCHITECTURE.md Section 8 -- this is
// where auth-state gating and redirect-to-login logic lives once
// authentication exists. Deliberately a pass-through today: this milestone
// explicitly excludes authentication logic. Wrapping routes in this
// component now (even though it does nothing yet) means the auth milestone
// adds logic here, not a route-tree restructure.
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  return <>{children}</>;
}

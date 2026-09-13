// Centralized route path constants (FRONTEND_ARCHITECTURE.md Section 8).
// Feature code and nav components import from here rather than hardcoding
// path strings, so a route rename happens in one place.
export const ROUTES = {
  home: '/',
  healthCheck: '/health-check',
  notFound: '*',
} as const;

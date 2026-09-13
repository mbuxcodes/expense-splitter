// Centralized endpoint path constants, matching API_SPECIFICATION.md Section 23
// exactly. No feature code should hardcode a path string -- import from here,
// so a path change (a versioning bump, a route rename) happens in one place.
export const API_ENDPOINTS = {
  health: {
    basic: '/health',
    database: '/health/database',
  },
  // Auth, groups, expenses, settlements, analytics endpoints are added here
  // as each feature milestone builds the RTK Query slice that consumes them
  // -- not created speculatively ahead of the feature itself.
} as const;

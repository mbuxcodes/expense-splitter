// Redux store configuration. FRONTEND_ARCHITECTURE.md Section 3: this file,
// not a separate top-level store/ folder, is where configureStore lives --
// consistent with app/ owning "store, router, providers" as one cohesive
// application-bootstrap concern.
//
// No slices exist yet. Per FRONTEND_ARCHITECTURE.md Section 5, this store
// holds only client-only global state (auth identity, UI preferences,
// notifications) -- server state is owned by RTK Query's cache, added here
// as middleware once the first feature's API slice exists (not yet).
import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  // authSlice, uiSlice, etc. are added here as each is actually built --
  // never scaffolded speculatively ahead of a real need.
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

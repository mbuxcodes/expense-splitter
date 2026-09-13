// Typed Redux hooks, colocated with the store they type against
// (FRONTEND_ARCHITECTURE.md Section 3 / Section 5). Feature code imports
// these instead of the plain react-redux hooks, so every dispatch/selector
// call is typed against RootState/AppDispatch without repeating the cast.
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store.js';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

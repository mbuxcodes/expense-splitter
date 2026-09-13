// Low-level Axios transport. This is infrastructure, not a competing way to
// fetch data -- FRONTEND_ARCHITECTURE.md ADR-002 makes RTK Query the owner
// of server state. This client exists to be wrapped by a custom RTK Query
// base query (features/*/api/*.ts, built in later milestones) so that
// interceptor logic (auth headers, single-flight refresh, error
// normalization) lives in exactly one place rather than being reimplemented
// per RTK Query endpoint.
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '../types/api.js';
import { ApiError } from '../types/api.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  // Fail fast in the browser console during development rather than every
  // request silently hitting a relative (wrong) URL.
  console.error(
    'VITE_API_BASE_URL is not set. Copy client/.env.example to client/.env and set it.',
  );
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true, // required once the refresh-token httpOnly cookie is in use
});

// Request interceptor foundation -- the access token (once auth exists,
// FRONTEND_ARCHITECTURE.md Section 7) is attached here, in one place, not
// per-call. Currently a pass-through.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

// Response interceptor foundation -- normalizes every error response into
// the typed ApiError shape (types/api.ts) before it reaches any call site,
// matching API_SPECIFICATION.md's standard error envelope. Token-refresh
// retry logic (FRONTEND_ARCHITECTURE.md Section 6's single-flight pattern)
// is added here in the authentication milestone -- not yet.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
      const body = error.response.data;
      return Promise.reject(
        new ApiError(
          body.message ?? 'Request failed.',
          body.errorCode ?? 'UNKNOWN_ERROR',
          error.response.status,
          body.details,
          body.requestId,
        ),
      );
    }

    if (axios.isAxiosError(error) && !error.response) {
      // Network failure -- distinct from a server-returned error
      // (FRONTEND_ARCHITECTURE.md Section 13's error-category distinction).
      return Promise.reject(
        new ApiError('Network error -- could not reach the server.', 'NETWORK_ERROR', 0),
      );
    }

    return Promise.reject(error);
  },
);

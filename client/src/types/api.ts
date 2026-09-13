// Shared API contract types, matching the backend's standard response
// envelope (API_SPECIFICATION.md Section 5 / BACKEND_ARCHITECTURE.md Section 14).
// Every RTK Query endpoint (added per-feature in later milestones) and this
// milestone's Axios transport layer both consume these -- one shape, one place.

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  details?: unknown;
  requestId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Thrown/returned by the Axios layer (services/apiClient.ts) once a response
// is known to be an error -- gives call sites a single, typed shape to
// switch on (by errorCode, per API_SPECIFICATION.md Section 6's registry),
// never by parsing `message` text.
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

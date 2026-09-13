// Custom error hierarchy. BACKEND_ARCHITECTURE.md Section 14: every thrown
// error in this codebase is one of these types (or extends AppError) --
// never a bare Error, never an inline res.status().json() in a controller.
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorCode: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errorCode = 'VALIDATION_ERROR', details?: unknown) {
    super(message, 400, errorCode, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, errorCode = 'AUTH_INVALID_CREDENTIALS', details?: unknown) {
    super(message, 401, errorCode, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string, errorCode = 'GROUP_ACCESS_DENIED', details?: unknown) {
    super(message, 403, errorCode, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, errorCode = 'NOT_FOUND', details?: unknown) {
    super(message, 404, errorCode, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 503, 'DATABASE_UNAVAILABLE', details);
  }
}

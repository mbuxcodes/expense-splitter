// Global error-handling middleware. BACKEND_ARCHITECTURE.md Section 14:
// registered LAST in the middleware chain (see app.ts) -- catches every
// error passed to next(err), regardless of origin.
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';

// Matches the standard error envelope fixed in API_SPECIFICATION.md Section 5.
interface ErrorResponseBody {
  success: false;
  message: string;
  errorCode: string;
  details?: unknown;
  requestId?: string;
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const requestId = req.headers['x-request-id'] as string | undefined;

  if (err instanceof AppError) {
    // Expected, typed error -- log at warn, not error (it's a normal
    // business-rule rejection, not a bug).
    logger.warn(`[${err.errorCode}] ${err.message}${requestId ? ` (requestId=${requestId})` : ''}`);

    const body: ErrorResponseBody = {
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(err.details !== undefined && { details: err.details }),
      ...(requestId && { requestId }),
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // Unrecognized error -- a genuine bug. Log full detail server-side,
  // return nothing internal to the client (SECURITY_ARCHITECTURE.md Section 16).
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  logger.error(`Unhandled error: ${message}${stack ? `\n${stack}` : ''}`);

  const body: ErrorResponseBody = {
    success: false,
    message: 'An unexpected error occurred.',
    errorCode: 'INTERNAL_SERVER_ERROR',
    ...(requestId && { requestId }),
  };
  res.status(500).json(body);
}

// Mounted after every route -- anything that falls through is an unknown route.
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
}

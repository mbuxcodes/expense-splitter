// Express application configuration: middleware and route registration only.
// No environment validation, no database connection, no app.listen() here --
// that's server.ts's job. This separation (BACKEND_ARCHITECTURE.md Section 3,
// Objective 3 of Milestone 4.3) means app.ts can be imported directly by
// tests (Supertest) without booting a real server or database connection.
import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { logger, morganStream } from './utils/logger.js';
import { healthRouter } from './routes/health.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp(): Application {
  const app = express();

  // Order matters (BACKEND_ARCHITECTURE.md Section 7): security headers and
  // CORS first, before any parsing work; error handler is registered last,
  // after every route, at the bottom of this function.
  app.use(helmet());
  app.use(
    cors({
      // Single, explicit allowed origin -- never a wildcard (SECURITY_ARCHITECTURE.md Section 6).
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev', { stream: morganStream }));
  }

  app.use(express.json());
  app.use(cookieParser());

  // Versioned API surface (API_SPECIFICATION.md Section 2: all routes under /api/v1).
  app.use('/api/v1', healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

// Re-exported so other modules (tests, server.ts) can log through the same
// configured logger without importing utils/logger.ts directly each time.
export { logger };

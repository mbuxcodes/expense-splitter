// Health check endpoints. API_SPECIFICATION.md Section 13: the only two
// routes in the entire API with no authentication requirement -- read-only,
// non-sensitive, used by deployment platforms and uptime monitors.
import { Router } from 'express';
import { isDatabaseConnected } from '../config/database.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'healthy' } });
});

healthRouter.get('/health/database', (_req, res) => {
  if (isDatabaseConnected()) {
    res.status(200).json({ success: true, data: { status: 'healthy', database: 'connected' } });
    return;
  }

  res.status(503).json({
    success: false,
    message: 'Database connectivity check failed.',
    errorCode: 'DATABASE_UNAVAILABLE',
  });
});

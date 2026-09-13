// Integration test: boots a real (in-memory) MongoDB, connects through the
// actual connectDatabase() module, and hits both health endpoints through
// the actual Express app -- via Supertest, not a mocked server.
//
// This validates the database connection code path against a real
// MongoDB-protocol server. It does NOT validate connectivity to a real
// MongoDB Atlas cluster specifically (network access, IP allowlist, real
// credentials) -- that must be confirmed against your own Atlas URI.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// env.ts validates process.env at import time, so required variables must
// exist before any project module is imported.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'a'.repeat(32);
process.env.CORS_ORIGIN = 'http://localhost:5173';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoServer?.stop();
});

describe('health endpoints', () => {
  it('GET /api/v1/health returns healthy without requiring a database connection', async () => {
    const { connectDatabase } = await import('./config/database.js');
    const { createApp } = await import('./app.js');
    await connectDatabase();
    const app = createApp();

    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { status: 'healthy' } });
  });

  it('GET /api/v1/health/database reports connected once connectDatabase() has succeeded', async () => {
    const { createApp } = await import('./app.js');
    const app = createApp();

    const res = await request(app).get('/api/v1/health/database');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { status: 'healthy', database: 'connected' } });
  });

  it('GET /api/v1/unknown-route returns the standard 404 error envelope', async () => {
    const { createApp } = await import('./app.js');
    const app = createApp();

    const res = await request(app).get('/api/v1/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.errorCode).toBe('ROUTE_NOT_FOUND');
  });
});

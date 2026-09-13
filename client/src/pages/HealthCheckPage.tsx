// Validates the Axios transport layer (services/apiClient.ts) against the
// real backend health endpoint end-to-end -- infrastructure verification,
// not a product feature, so it stays in scope for a foundation milestone.
import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient.js';
import { API_ENDPOINTS } from '../services/apiEndpoints.js';
import type { ApiResponse } from '../types/api.js';

type HealthStatus = 'checking' | 'healthy' | 'unreachable';

export function HealthCheckPage(): React.JSX.Element {
  const [status, setStatus] = useState<HealthStatus>('checking');

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get<ApiResponse<{ status: string }>>(API_ENDPOINTS.health.basic)
      .then(() => {
        if (!cancelled) setStatus('healthy');
      })
      .catch(() => {
        if (!cancelled) setStatus('unreachable');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1>API Health Check</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

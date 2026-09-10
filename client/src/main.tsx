// Milestone 4.1 placeholder entrypoint.
// Router, Redux store, and providers are wired in Milestone 4.4 (Frontend Foundation).
// See client/src/app/README.md and FRONTEND_ARCHITECTURE.md Section 3.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function App(): React.JSX.Element {
  return <div>Expense Splitter — scaffold</div>;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

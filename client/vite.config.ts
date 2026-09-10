import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Milestone 4.1: scaffold only. Dev-server proxy / env wiring happens in Milestone 4.3-4.4.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

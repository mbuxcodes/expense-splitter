// Application entrypoint: environment validation, database connection, then
// (and only then) server startup. BACKEND_ARCHITECTURE.md Objective 3:
// app.ts owns HOW requests are handled; server.ts owns the boot sequence.
import { env } from './config/env.js'; // importing triggers fail-fast validation
import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';

async function main(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`Expense Splitter API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((error) => {
  logger.error(`Fatal startup error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

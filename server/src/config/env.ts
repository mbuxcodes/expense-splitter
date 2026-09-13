// Environment variable loading and validation.
// Fails fast at startup if a required variable is missing or malformed --
// per BACKEND_ARCHITECTURE.md Section 16: "a missing required variable fails
// fast at boot rather than causing a confusing runtime error later."
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters (see SECURITY_ARCHITECTURE.md Section 2)'),
  CORS_ORIGIN: z.string().url('CORS_ORIGIN must be a valid URL, e.g. http://localhost:5173'),
});

type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    // Deliberately clear, human-readable output -- this is the failure mode
    // a developer hits first, so it must explain exactly what to fix.
    console.error('\nInvalid or missing environment variables:\n');
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    console.error('\nCheck server/.env against server/.env.example.\n');
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();

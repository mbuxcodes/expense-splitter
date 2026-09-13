// Winston-based structured logger. BACKEND_ARCHITECTURE.md Section 18:
// verbose/readable in development, structured JSON + warn-and-above in
// production. Never logs sensitive data (passwords, tokens, cookies) --
// enforced by discipline at each call site, since this logger has no way
// to know which fields are sensitive.
import winston from 'winston';
import { env } from '../config/env.js';

const isProduction = env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: isProduction ? 'warn' : 'debug',
  format: isProduction
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
        ),
      ),
  transports: [new winston.transports.Console()],
});

// Morgan writes HTTP request lines through this logger's 'http' level in
// development, so request logs and application logs share one output stream.
export const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};

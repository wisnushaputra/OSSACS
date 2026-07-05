import pino from 'pino';
import { config } from '../config';

// Determine the transport based on the environment
const transport =
  config.nodeEnv === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined; // In production, usually default JSON to stdout is preferred

export const logger = pino({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  transport,
  base: undefined, // Removes pid and hostname from the default JSON output if transport is not used
});

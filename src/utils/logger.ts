import pino from 'pino';
import { config } from '../config';

export const logger = pino({
  level: process.env.NODE_ENV === 'test' ? 'silent' : config.nodeEnv === 'development' ? 'debug' : 'info',
  transport: process.env.NODE_ENV !== 'test' ? {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  } : undefined
});

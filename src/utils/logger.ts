import pino from 'pino';
import { config } from '../config';

export const logger = pino({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

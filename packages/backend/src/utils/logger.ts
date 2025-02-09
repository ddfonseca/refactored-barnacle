import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino from 'pino';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: pino.Logger;

  constructor(private configService: ConfigService) {
    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    this.logger = pino({
      level: nodeEnv === 'test' ? 'silent' : nodeEnv === 'development' ? 'debug' : 'info',
      transport: nodeEnv !== 'test' ? {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      } : undefined
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams);
  }
}

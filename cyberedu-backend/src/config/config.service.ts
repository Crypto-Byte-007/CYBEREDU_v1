// src/config/config.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('nodeEnv')!;
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get port(): number {
    return this.config.get<number>('port', 3000);
  }

  get apiPrefix(): string {
    return this.config.get<string>('apiPrefix', '/api/v1');
  }

  get database() {
    return {
      uri: this.config.get<string>('database.uri')!,
      testUri: this.config.get<string>('database.testUri')!,
    };
  }

  // 🔐 FIXED JWT CONFIG (V006 CLOSED)
  get jwt() {
    return {
      accessSecret: this.config.get<string>('jwt.accessSecret')!,
      refreshSecret: this.config.get<string>('jwt.refreshSecret')!,
      accessExpiresIn: this.config.get<string>(
        'jwt.accessExpiresIn',
      )!,
      refreshExpiresIn: this.config.get<string>(
        'jwt.refreshExpiresIn',
      )!,
    };
  }

  get logging() {
    return {
      level: this.config.get<string>('logging.level', 'info'),
      logToFile: this.config.get<boolean>('logging.logToFile', false),
    };
  }
}

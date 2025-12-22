import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  /* ===============================
     ENVIRONMENT
  =============================== */

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv !== 'production';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  /* ===============================
     SERVER
  =============================== */

  get port(): number {
    return Number(this.config.get<number>('PORT', 3000));
  }

  get apiPrefix(): string {
    return '/api/v1';
  }

  /* ===============================
     DATABASE
  =============================== */

  get database() {
  return {
    uri:
      this.configService.get<string>('MONGODB_URI') ||
      this.configService.get<string>('database.uri') ||
      'mongodb://localhost:27017/cyberedu',

    testUri:
      this.configService.get<string>('MONGODB_TEST_URI') ||
      'mongodb://localhost:27017/cyberedu_test',
  };
}


  /* ===============================
     JWT
  =============================== */

  get jwt() {
    const secret = this.config.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        '❌ JWT_SECRET is not set. Add it in Railway Variables.',
      );
    }

    return {
      secret,
      expiresIn: '1h',
    };
  }

  /* ===============================
     LOGGING
  =============================== */

  get logging() {
    return {
      level: this.config.get<string>('LOG_LEVEL', 'info'),
      logToFile: false,
    };
  }
}

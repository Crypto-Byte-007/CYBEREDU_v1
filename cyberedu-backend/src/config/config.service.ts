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
    const uri = this.config.get<string>('MONGODB_URI');

    // 🚨 HARD FAIL (NO FALLBACKS)
    if (!uri) {
      throw new Error(
        '❌ MONGODB_URI is not set. Add it in Railway Variables.',
      );
    }

    console.log('🔥 Using MongoDB URI:', uri.replace(/\/\/.*@/, '//***@'));

    return { uri };
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

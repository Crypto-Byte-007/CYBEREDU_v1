import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('nodeEnv', 'development');
  }

  get port(): number {
    return this.config.get<number>('port', 3000);
  }

  get apiPrefix(): string {
    return this.config.get<string>('apiPrefix', '/api/v1');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get database() {
    return {
      uri: this.config.get<string>(
        'database.uri',
        'mongodb://localhost:27017/cyberedu',
      ),
      testUri: this.config.get<string>(
        'database.testUri',
        'mongodb://localhost:27017/cyberedu_test',
      ),
    };
  }

  get jwt() {
    return {
      secret: this.config.get<string>(
        'jwt.secret',
        'change_this_in_production',
      ),
      accessExpiration: this.config.get<string>(
        'jwt.accessExpiration',
        '15m',
      ),
      refreshExpiration: this.config.get<string>(
        'jwt.refreshExpiration',
        '7d',
      ),
    };
  }

  get logging() {
    return {
      level: this.config.get<string>('logging.level', 'info'),
      logToFile: this.config.get<boolean>('logging.logToFile', false),
    };
  }
}

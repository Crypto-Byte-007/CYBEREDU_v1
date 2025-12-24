import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

import { AppConfigService } from '../config/config.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    /**
     * JwtModule is used ONLY for ACCESS TOKENS
     * Refresh tokens are signed manually in AuthService
     */
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): JwtModuleOptions => ({
        secret: config.jwt.accessSecret,
        signOptions: {
          // ⚠️ TypeScript fix: Nest expects number | StringValue
          expiresIn: config.jwt.accessExpiresIn as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

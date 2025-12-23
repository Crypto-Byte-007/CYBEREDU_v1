// src/app.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/* ===============================
   CORE MODULES
================================ */
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

/* ===============================
   FEATURE MODULES
================================ */
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LabsModule } from './labs/labs.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';

/* ===============================
   MIDDLEWARE
================================ */
import { LoggingMiddleware } from './common/middleware/logging.middleware';

@Module({
  imports: [
    // 🔐 Configuration must load first
    AppConfigModule,

    // 🗄️ Database connection
    DatabaseModule,

    // 🩺 Health checks (important for Railway)
    HealthModule,

    // 🔑 Authentication & users
    AuthModule,
    UsersModule,

    // 🧪 Core platform features
    LabsModule,
    ReportsModule,

    // 🔔 Supporting services
    NotificationsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      // ❗ Exclude health checks from logging noise
      .exclude('health')
      .forRoutes('*');
  }
}

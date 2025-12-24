import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  /**
   * =========================
   * GLOBAL API PREFIX
   * =========================
   */
  app.setGlobalPrefix(configService.apiPrefix);

  /**
   * =========================
   * GLOBAL VALIDATION
   * =========================
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * =========================
   * GLOBAL FILTERS
   * =========================
   */
  app.useGlobalFilters(new GlobalExceptionFilter());

  /**
   * =========================
   * GLOBAL INTERCEPTORS
   * =========================
   */
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  /**
   * =========================
   * CORS CONFIGURATION
   * =========================
   * - Local frontend
   * - Netlify frontend
   */
  app.enableCors({
    origin: [
      'http://localhost:51442', // local frontend (serve)
      'http://localhost:3000',  // optional local testing
      'https://nullcyberedu.netlify.app', // 🔴 REPLACE THIS
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  /**
   * =========================
   * START SERVER
   * =========================
   * Railway injects PORT automatically
   */
  const port = configService.port || 3000;
  await app.listen(port);

  /**
   * =========================
   * STARTUP LOG
   * =========================
   */
  console.log(`
🚀 CyberEdu Backend Started
----------------------------------
✅ Environment : ${configService.nodeEnv}
✅ API         : http://localhost:${port}${configService.apiPrefix}
✅ Health      : http://localhost:${port}${configService.apiPrefix}/health
✅ Database    : CONNECTED
✅ Auth        : JWT Ready
----------------------------------
  `);
}

bootstrap();

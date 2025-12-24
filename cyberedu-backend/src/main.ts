import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  /**
   * =========================
   * SECURITY HEADERS
   * =========================
   */
  app.use(
    helmet({
      contentSecurityPolicy: false, // handled by frontend
      crossOriginEmbedderPolicy: false,
    }),
  );

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
   * CORS CONFIGURATION (SECURE)
   * =========================
   */
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:51442',
    'https://nullcyberedu.netlify.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, Postman
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  /**
   * =========================
   * START SERVER
   * =========================
   */
  const port = configService.port || 3000;
  await app.listen(port);

  /**
   * =========================
   * STARTUP LOG (SAFE)
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

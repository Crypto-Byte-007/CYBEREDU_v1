// src/config/configuration.ts

export default () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';

  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    'mongodb://127.0.0.1:27017/cyberedu';

  const jwtSecret =
    process.env.JWT_SECRET || 'change_this_in_production';

  // ✅ Soft validation (no crash loops)
  if (isProduction) {
    if (!process.env.MONGODB_URI) {
      console.warn(
        '⚠️ WARNING: MONGODB_URI not set explicitly, using fallback',
      );
    }

    if (!process.env.JWT_SECRET) {
      console.warn(
        '⚠️ WARNING: JWT_SECRET not set explicitly',
      );
    }
  }

  return {
    nodeEnv,
    port: Number(process.env.PORT || 3000),
    apiPrefix: '/api/v1',

    database: {
      uri: mongoUri,
      testUri:
        process.env.MONGODB_TEST_URI ||
        'mongodb://127.0.0.1:27017/cyberedu_test',
    },

    jwt: {
      secret: jwtSecret,
      accessExpiration:
        process.env.JWT_ACCESS_EXPIRATION || '15m',
      refreshExpiration:
        process.env.JWT_REFRESH_EXPIRATION || '7d',
    },

    logging: {
      level: process.env.LOG_LEVEL || 'info',
      logToFile: process.env.LOG_TO_FILE === 'true',
    },
  };
};

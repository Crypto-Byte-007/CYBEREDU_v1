// src/config/configuration.ts

export default () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    'mongodb://127.0.0.1:27017/cyberedu';

  if (!mongoUri) {
    throw new Error('MongoDB URI is not configured');
  }

  // 🚨 JWT secrets MUST exist in production
  if (nodeEnv === 'production') {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error(
        'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in production',
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
      accessSecret:
        process.env.JWT_ACCESS_SECRET || 'dev_access_secret_only',
      refreshSecret:
        process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_only',
      accessExpiresIn:
        process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      refreshExpiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    logging: {
      level: process.env.LOG_LEVEL || 'info',
      logToFile: process.env.LOG_TO_FILE === 'true',
    },
  };
};

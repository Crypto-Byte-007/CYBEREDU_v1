export default () => {
  const isProduction = process.env.NODE_ENV === 'production';

  /* ===============================
     DATABASE (NO FALLBACKS)
  =============================== */
  if (isProduction && !process.env.MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is required in production');
  }

  if (isProduction && !process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is required in production');
  }

  return {
    /* ===============================
       SERVER
    =============================== */
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 3000),

    // keep single source of truth
    apiPrefix: '/api/v1',

    /* ===============================
       DATABASE
    =============================== */
    database: {
      uri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/cyberedu',
      testUri:
        process.env.MONGODB_TEST_URI ??
        'mongodb://127.0.0.1:27017/cyberedu_test',
    },

    /* ===============================
       JWT
    =============================== */
    jwt: {
      secret: process.env.JWT_SECRET ?? 'dev-secret-only',
      accessExpiration: process.env.JWT_ACCESS_EXPIRATION ?? '15m',
      refreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
    },

    /* ===============================
       LOGGING
    =============================== */
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      logToFile: process.env.LOG_TO_FILE === 'true',
    },
  };
};

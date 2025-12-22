import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../config/config.service';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const uri = configService.database.uri;

        // 🔥 HARD FAIL IF URI IS MISSING (VERY IMPORTANT)
        if (!uri) {
          throw new Error(
            '❌ MONGODB_URI is not defined. Check Railway environment variables.',
          );
        }

        // 🔍 DEBUG (SAFE TO KEEP FOR NOW)
        console.log('🔥 Using MongoDB URI:', uri.replace(/\/\/.*@/, '//***@'));

        return {
          uri,
          retryAttempts: 5,
          retryDelay: 3000,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log(
                `✅ MongoDB connected: ${connection.db.databaseName}`,
              );
            });

            connection.on('error', (error) => {
              console.error('❌ MongoDB connection error:', error.message);
            });

            connection.on('disconnected', () => {
              console.warn('⚠️ MongoDB disconnected');
            });

            return connection;
          },
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

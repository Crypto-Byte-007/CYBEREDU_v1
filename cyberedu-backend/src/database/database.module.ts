import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../config/config.service';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.database.uri,

        // 🔥 IMPORTANT FIX: disable auto index in production
        autoIndex: configService.isDevelopment,

        directConnection: false,
        serverSelectionTimeoutMS: 10000,
        retryAttempts: 3,
        retryDelay: 1000,

        connectionFactory: (connection: any) => {
          connection.on('connected', () => {
            console.log(
              `✅ MongoDB connected to ${connection.db.databaseName}`,
            );
          });

          connection.on('error', (error: any) => {
            console.error('❌ MongoDB connection error:', error);
          });

          return connection;
        },
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

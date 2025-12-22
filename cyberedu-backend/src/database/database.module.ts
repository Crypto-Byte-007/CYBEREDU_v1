import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
          throw new Error('❌ MONGODB_URI is not defined');
        }

        console.log('🔥 Connecting to MongoDB:', uri.replace(/\/\/.*@/, '//***@'));

        return {
          uri,
          retryAttempts: 5,
          retryDelay: 3000,
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

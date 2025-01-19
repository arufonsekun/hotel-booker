import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { databaseProviders } from './database/database.providers';
import { BookingModule } from './booking/booking.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig, CONFIG_DATABASE } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get(CONFIG_DATABASE).uri,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}

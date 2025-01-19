import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { userProviders } from './user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DatabaseModule,
  ],
  providers: [UserService, ...userProviders],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

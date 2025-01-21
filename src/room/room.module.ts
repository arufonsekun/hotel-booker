import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { roomProviders } from './room.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { Room, RoomSchema } from './room.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    DatabaseModule,
    UserModule,
  ],
  providers: [RoomService, ...roomProviders],
  controllers: [RoomController],
})
export class RoomModule {}

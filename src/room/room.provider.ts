import { Connection } from 'mongoose';
import { Room, RoomSchema } from './room.schema';

export const roomProviders = [
  {
    provide: 'ROOM_MODEL',
    inject: ['DATABASE_CONNECTION'],
    useFactory: (connection: Connection) => connection.model(Room.name, RoomSchema),
  },
];

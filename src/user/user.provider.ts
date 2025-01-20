import { Connection } from 'mongoose';
import { User, UserSchema } from './user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    inject: ['DATABASE_CONNECTION'],
    useFactory: (connection: Connection) => connection.model(User.name, UserSchema),
  },
];

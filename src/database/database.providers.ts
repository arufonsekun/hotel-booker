import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CONFIG_DATABASE } from '../config/database.config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
      const { uri } = configService.get(CONFIG_DATABASE);
      return mongoose.connect(uri);
    },
  },
];

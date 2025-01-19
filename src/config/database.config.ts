import { registerAs } from '@nestjs/config';

export const CONFIG_DATABASE = 'database';

export const databaseConfig = registerAs(CONFIG_DATABASE, () => ({
  uri: process.env.DATABASE_URL,
}));

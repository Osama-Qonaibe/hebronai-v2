import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import * as schema from './schema.pg';

export const pgDb = drizzlePg(process.env.POSTGRES_URL!, {
  schema,
});

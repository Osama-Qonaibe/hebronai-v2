import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.pg";

export const pgDb = drizzle(process.env.POSTGRES_URL!, {
  schema,
});

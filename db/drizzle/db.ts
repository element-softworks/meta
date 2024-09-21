import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema/index';

const pool = postgres(process.env.AUTH_DRIZZLE_URL!, { max: 1 });

export const db = drizzle(pool, {
	schema,
});

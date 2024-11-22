import type { Log } from './validator';
import { drizzle, type AnyD1Database } from 'drizzle-orm/d1';
import { contacts } from '../../db/schema';

export async function log(db: AnyD1Database, value: Log) {
	const drizzleDb = drizzle(db);
	const result = await drizzleDb.insert(contacts).values(value);
	return result;
}

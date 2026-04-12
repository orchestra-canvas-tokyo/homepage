import { drizzle } from 'drizzle-orm/d1';
import { contacts, type ContactLogEntry } from './schema';

type ContactDatabase = NonNullable<App.Platform['env']['DB']>;

export const writeContactLog = async (
	db: ContactDatabase,
	entry: ContactLogEntry
): Promise<void> => {
	await drizzle(db).insert(contacts).values(entry);
};

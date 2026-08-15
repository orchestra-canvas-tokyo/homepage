import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ContactCategoryKey } from '$lib/contact/form';

export const contacts = sqliteTable('contacts', {
	id: text('id').primaryKey(),
	status: text('status').notNull(),
	sentAt: text('sent_at').notNull(),
	name: text('name'),
	email: text('email').notNull(),
	categoryKey: text('category_key').notNull(),
	body: text('body').notNull()
});

export type ContactLogStatus = 'email_sent' | 'email_failed';

export type ContactLogEntry = {
	id: string;
	status: ContactLogStatus;
	sentAt: string;
	name: string | null;
	email: string;
	categoryKey: ContactCategoryKey;
	body: string;
};

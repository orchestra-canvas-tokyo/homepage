import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contacts = sqliteTable('contacts', {
	id: text('id').primaryKey(),
	status: text('status').notNull(),
	sentAt: text('sentAt').notNull(),
	name: text('name'),
	email: text('email').notNull(),
	categoryKey: text('category').notNull(),
	body: text('body').notNull(),
	csrfToken: text('csrfToken').notNull(),
	reCaptchaToken: text('reCaptchaToken').notNull()
});

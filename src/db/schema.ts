import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contacts = sqliteTable('contacts', {
	sentAt: text('sentAt').primaryKey(),
	name: text('name'),
	email: text('mailAddress').notNull(),
	categoryKey: text('category').notNull(),
	body: text('body').notNull(),
	csrfToken: text('csrfToken').notNull(),
	reCaptchaToken: text('reCaptchaToken').notNull()
});

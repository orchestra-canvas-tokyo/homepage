import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';

const readMigration = (filename: string): string =>
	readFileSync(resolve('migrations', filename), 'utf8');

describe('contact migrations', () => {
	it('preserves legacy records while removing stored token columns', () => {
		const db = new DatabaseSync(':memory:');
		db.exec(readMigration('0000_legacy_contact_compatibility.sql'));
		db.prepare('INSERT INTO contacts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
			'id-1',
			'email_sent',
			'2026-08-13T00:00:00Z',
			'Canvas',
			'contact@example.com',
			'others',
			'body',
			'csrf-token',
			'captcha-token'
		);

		db.exec(readMigration('0001_create_contacts.sql'));

		const columns = db
			.prepare('PRAGMA table_info(contacts)')
			.all()
			.map((column) => column.name);
		expect(columns).toEqual(['id', 'status', 'sent_at', 'name', 'email', 'category_key', 'body']);
		expect(db.prepare('SELECT * FROM contacts').get()).toEqual({
			id: 'id-1',
			status: 'email_sent',
			sent_at: '2026-08-13T00:00:00Z',
			name: 'Canvas',
			email: 'contact@example.com',
			category_key: 'others',
			body: 'body'
		});

		db.close();
	});
});

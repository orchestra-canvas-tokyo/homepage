CREATE TABLE contacts_v2 (
	id TEXT PRIMARY KEY NOT NULL,
	status TEXT NOT NULL,
	sent_at TEXT NOT NULL,
	name TEXT,
	email TEXT NOT NULL,
	category_key TEXT NOT NULL,
	body TEXT NOT NULL
);

INSERT INTO contacts_v2 (id, status, sent_at, name, email, category_key, body)
SELECT id, status, sentAt, name, email, category, body
FROM contacts;

DROP TABLE contacts;
ALTER TABLE contacts_v2 RENAME TO contacts;

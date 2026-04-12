CREATE TABLE IF NOT EXISTS contacts (
	id TEXT PRIMARY KEY,
	status TEXT NOT NULL,
	sent_at TEXT NOT NULL,
	name TEXT,
	email TEXT NOT NULL,
	category_key TEXT NOT NULL,
	body TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS contacts_sent_at_idx ON contacts(sent_at DESC);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts(status);

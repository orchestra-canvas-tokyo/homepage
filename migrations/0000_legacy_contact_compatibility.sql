-- Compatibility baseline for the standalone contact application's original schema.
-- Existing databases keep their table; empty databases receive the legacy shape so
-- the following migration can use one deterministic data-preserving conversion.
CREATE TABLE IF NOT EXISTS contacts (
	id TEXT PRIMARY KEY NOT NULL,
	status TEXT NOT NULL,
	sentAt TEXT NOT NULL,
	name TEXT,
	email TEXT NOT NULL,
	category TEXT NOT NULL,
	body TEXT NOT NULL,
	csrfToken TEXT NOT NULL,
	reCaptchaToken TEXT NOT NULL
);

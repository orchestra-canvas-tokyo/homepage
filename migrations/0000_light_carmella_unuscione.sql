CREATE TABLE `contacts` (
	`sentAt` text PRIMARY KEY NOT NULL,
	`name` text,
	`mailAddress` text NOT NULL,
	`category` text NOT NULL,
	`body` text NOT NULL,
	`csrfToken` text NOT NULL,
	`reCaptchaToken` text NOT NULL
);

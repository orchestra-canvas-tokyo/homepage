CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`sentAt` text NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`category` text NOT NULL,
	`body` text NOT NULL,
	`csrfToken` text NOT NULL,
	`reCaptchaToken` text NOT NULL
);

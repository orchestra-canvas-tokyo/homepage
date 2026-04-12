type ContactPlatformEnv = Partial<NonNullable<App.Platform['env']>> | undefined;
type ContactDatabase = NonNullable<App.Platform['env']['DB']>;
const defaultTurnstileSiteKey = '0x4AAAAAAC8aVLMvG7TLd5z2';

const readNonEmptyString = (value: unknown): string | null =>
	typeof value === 'string' && value.length > 0 ? value : null;

const readProcessEnv = (key: string): string | null => {
	if (typeof process === 'undefined') return null;
	return readNonEmptyString(process.env[key]);
};

export type ContactRuntimeConfig = {
	db: ContactDatabase | null;
	turnstileSiteKey: string | null;
	turnstileSecretKey: string | null;
	resendApiKey: string | null;
	slackWebhookUrl: string | null;
	deploymentBranch: string | null;
	isProduction: boolean;
};

export const resolveContactRuntimeConfig = (
	platformEnv?: ContactPlatformEnv
): ContactRuntimeConfig => {
	const deploymentBranch =
		readNonEmptyString(platformEnv?.CF_PAGES_BRANCH) ?? readProcessEnv('CF_PAGES_BRANCH');

	return {
		db: platformEnv?.DB ?? null,
		turnstileSiteKey:
			readNonEmptyString(platformEnv?.TURNSTILE_SITE_KEY) ??
			readProcessEnv('TURNSTILE_SITE_KEY') ??
			defaultTurnstileSiteKey,
		turnstileSecretKey:
			readNonEmptyString(platformEnv?.TURNSTILE_SECRET_KEY) ??
			readProcessEnv('TURNSTILE_SECRET_KEY') ??
			readNonEmptyString(platformEnv?.TURNSTILE_SECRET) ??
			readProcessEnv('TURNSTILE_SECRET'),
		resendApiKey:
			readNonEmptyString(platformEnv?.RESEND_API_KEY) ?? readProcessEnv('RESEND_API_KEY'),
		slackWebhookUrl:
			readNonEmptyString(platformEnv?.SLACK_WEBHOOK_URL) ?? readProcessEnv('SLACK_WEBHOOK_URL'),
		deploymentBranch,
		isProduction: deploymentBranch === 'production'
	};
};

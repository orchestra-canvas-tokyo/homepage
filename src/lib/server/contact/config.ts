import { env } from '$env/dynamic/private';

type ContactPlatformEnv = Partial<NonNullable<App.Platform['env']>> | undefined;
type ContactDatabase = NonNullable<App.Platform['env']['DB']>;
type ContactStringEnvKey = Exclude<keyof NonNullable<ContactPlatformEnv>, 'DB'>;

const alwaysPassTurnstileSiteKey = '1x00000000000000000000AA';

const readNonEmptyString = (value: unknown): string | null =>
	typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const readEnv = (platformEnv: ContactPlatformEnv, key: ContactStringEnvKey) =>
	readNonEmptyString(platformEnv?.[key]) ?? readNonEmptyString(env[key]);

const parseHostnames = (value: string | null): string[] =>
	value
		?.split(',')
		.map((hostname) => hostname.trim().toLowerCase())
		.filter(Boolean) ?? [];

const localHostnames = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

export type ContactRuntimeConfig = {
	db: ContactDatabase | null;
	deploymentEnv: string;
	isProduction: boolean;
	turnstileSiteKey: string | null;
	turnstileSecretKey: string | null;
	turnstileHostnames: string[];
	allowTurnstileTestingResponse: boolean;
	resendApiKey: string | null;
	slackWebhookUrl: string | null;
	configurationError: string | null;
};

export const resolveContactRuntimeConfig = (
	platformEnv?: ContactPlatformEnv
): ContactRuntimeConfig => {
	const deploymentEnv = readEnv(platformEnv, 'DEPLOYMENT_ENV') ?? 'local';
	const isProduction = deploymentEnv === 'production';
	const turnstileSiteKey = readEnv(platformEnv, 'TURNSTILE_SITE_KEY');
	const turnstileHostnames = parseHostnames(readEnv(platformEnv, 'TURNSTILE_HOSTNAMES'));
	const hasUnsafeProductionHostname =
		isProduction && turnstileHostnames.some((hostname) => localHostnames.has(hostname));

	return {
		db: platformEnv?.DB ?? null,
		deploymentEnv,
		isProduction,
		turnstileSiteKey,
		turnstileSecretKey: readEnv(platformEnv, 'TURNSTILE_SECRET_KEY'),
		turnstileHostnames,
		allowTurnstileTestingResponse: !isProduction && turnstileSiteKey === alwaysPassTurnstileSiteKey,
		resendApiKey: readEnv(platformEnv, 'RESEND_API_KEY'),
		slackWebhookUrl: readEnv(platformEnv, 'SLACK_WEBHOOK_URL'),
		configurationError: hasUnsafeProductionHostname
			? 'Production Turnstile hostnames must not include local development hosts.'
			: null
	};
};

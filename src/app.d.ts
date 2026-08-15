// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB?: D1Database;
				DEPLOYMENT_ENV?: string;
				TURNSTILE_SITE_KEY?: string;
				TURNSTILE_SECRET_KEY?: string;
				TURNSTILE_HOSTNAMES?: string;
				RESEND_API_KEY?: string;
				SLACK_WEBHOOK_URL?: string;
			};
			context?: ExecutionContext;
		}
	}
}

export {};

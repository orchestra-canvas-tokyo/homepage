// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	interface Window {
		grecaptcha?: typeof grecaptcha;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB?: D1Database;
				CF_PAGES_BRANCH?: string;
				RECAPTCHA_SITE_KEY?: string;
				RECAPTCHA_SECRET?: string;
				RESEND_API_KEY?: string;
				SLACK_WEBHOOK_URL?: string;
			};
		}
	}
}

export {};

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	interface TurnstileRenderOptions {
		sitekey: string;
		action?: string;
		theme?: 'auto' | 'light' | 'dark';
		size?: 'normal' | 'flexible' | 'compact';
		callback?: (token: string) => void;
		'error-callback'?: () => void;
		'expired-callback'?: () => void;
	}

	interface Turnstile {
		render(container: HTMLElement | string, options: TurnstileRenderOptions): string;
		reset(widgetId?: string): void;
		remove(widgetId?: string): void;
	}

	interface Window {
		turnstile?: Turnstile;
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
				TURNSTILE_SITE_KEY?: string;
				TURNSTILE_SECRET?: string;
				TURNSTILE_SECRET_KEY?: string;
				RESEND_API_KEY?: string;
				SLACK_WEBHOOK_URL?: string;
			};
		}
	}
}

export {};

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
				KV: KVNamespace;
				DB: D1Database;
				RECAPTCHA_SECRET: string;
				RESEND_API_KEY: string;
			};
		}
	}
}

export {};

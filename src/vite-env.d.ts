/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_RECAPTCHA_SECRET: string;
	readonly VITE_RESEND_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

declare module '@splidejs/svelte-splide/css/core';

interface ImportMetaEnv {
	readonly VITE_RECAPTCHA_SECRET: string;
	readonly VITE_RESEND_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

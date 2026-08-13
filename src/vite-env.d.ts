/// <reference types="vite/client" />

declare module '@splidejs/svelte-splide/css/core';

interface TurnstileApi {
	render: (
		container: HTMLElement,
		options: {
			sitekey: string;
			action: string;
			appearance: 'interaction-only';
			callback: (token: string) => void;
			'expired-callback': () => void;
			'error-callback': () => void;
		}
	) => string;
	reset: (widgetId: string) => void;
	remove: (widgetId: string) => void;
}

interface Window {
	turnstile?: TurnstileApi;
}

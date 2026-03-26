import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: process.env.VITEST
		? {
				// Svelte 5 以降の export condition を優先しつつ既存のブラウザ条件も維持
				conditions: ['svelte', 'browser']
			}
		: undefined
});

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// コンポーネントをクライアントサイドでテストするためにDOM環境を設定
		environment: 'jsdom',
		// テストファイルのパターンを指定
		include: ['src/**/*.{test,spec}.{js,ts}'],
		// テストのセットアップファイルを指定
		setupFiles: ['src/setupTests.js'],
		// グローバルなテスト設定
		globals: true
	},
	resolve: process.env.VITEST
		? {
				// Svelte 5 以降の export condition を優先しつつ既存のブラウザ条件も維持
				conditions: ['svelte', 'browser']
			}
		: undefined
});

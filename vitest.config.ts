import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			// コンポーネントをクライアントサイドでテストするためにDOM環境を設定
			environment: 'jsdom',
			// テストファイルのパターンを指定
			include: ['src/**/*.{test,spec}.{js,ts}'],
			// テストのセットアップファイルを指定
			setupFiles: ['src/setupTests.js'],
			// グローバルなテスト設定
			globals: true
		}
	})
);

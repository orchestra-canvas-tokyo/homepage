import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Meta from '../Meta.svelte';

/**
 * Metaコンポーネントの仕様：
 *
 * 1. 基本構造と目的
 *   - ページのメタ情報を設定するためのコンポーネント
 *   - svelte-meta-tagsライブラリのMetaTagsコンポーネントを使用
 *   - SEOやソーシャルメディア共有のためのメタタグを設定
 *
 * 2. プロパティ
 *   - title: ページのタイトル（必須）。ルートページの場合は空文字列を指定
 *   - canonical: 正規URL（必須）。相対URLを指定（例: '/concerts/example'）
 *
 * 3. 派生値
 *   - fullTitle: titleが空でない場合は「{title} - Orchestra Canvas Tokyo」、空の場合は「Orchestra Canvas Tokyo」
 *   - fullCanonical: canonicalの前に「https://www.orch-canvas.tokyo」を付加
 *
 * 4. Twitter Card
 *   - site: '@Orch_canvas'
 *   - cardType: 'summary'
 *   - title: fullTitleと同じ
 *   - image: 'https://www.orch-canvas.tokyo/web-app-manifest-512x512.png'
 *   - imageAlt: 'Orchestra Canvas Tokyoのロゴ'
 *
 * 5. SEO対策
 *   - 正規URLの設定によるSEO最適化
 *   - 適切なタイトル設定によるSEO対策
 *   - ソーシャルメディア共有のための最適化
 */

describe('Meta.svelte', () => {
	// テスト用のデフォルトプロパティ
	const defaultProps = {
		title: 'テストページ',
		canonical: '/test'
	};

	describe('タイトル生成', () => {
		it('タイトルが空でない場合、「{title} - Orchestra Canvas Tokyo」形式のタイトルが生成される', () => {
			// Arrange: 通常のタイトルのテスト
			const props = { title: 'テストページ', canonical: '/test' };
			const expected = 'テストページ - Orchestra Canvas Tokyo';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: 正しいタイトルが生成されることを確認
			expect(document.title).toBe(expected);
		});

		it('タイトルが空の場合、「Orchestra Canvas Tokyo」のみが表示される', () => {
			// Arrange: 空のタイトルのテスト
			const props = { title: '', canonical: '/' };
			const expected = 'Orchestra Canvas Tokyo';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: デフォルトのタイトルのみが表示されることを確認
			expect(document.title).toBe(expected);
		});
	});

	describe('正規URL（canonical）の生成', () => {
		it('相対パス（/で始まる）の場合、「https://www.orch-canvas.tokyo」が前に付加される', () => {
			// Arrange: 通常の相対パスのテスト
			const props = { title: 'テスト', canonical: '/test' };
			const expected = 'https://www.orch-canvas.tokyo/test';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: 正しい正規URLが生成されることを確認
			const canonicalLink = document.querySelector('link[rel="canonical"]');
			expect(canonicalLink?.getAttribute('href')).toBe(expected);
		});

		it('相対パスが/なしの場合、自動的に/が追加される', () => {
			// Arrange: /なしの相対パスのテスト
			const props = { title: 'テスト', canonical: 'test' };
			const expected = 'https://www.orch-canvas.tokyo/test';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: /が自動的に追加されることを確認
			const canonicalLink = document.querySelector('link[rel="canonical"]');
			expect(canonicalLink?.getAttribute('href')).toBe(expected);
		});

		it('canonicalが空の場合はベースURLのみとなる', () => {
			// Arrange: 空のcanonicalのテスト
			const props = { title: 'テスト', canonical: '' };
			const expected = 'https://www.orch-canvas.tokyo';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: ベースURLのみが設定されることを確認
			const canonicalLink = document.querySelector('link[rel="canonical"]');
			expect(canonicalLink?.getAttribute('href')).toBe(expected);
		});
	});

	describe('Twitter Card設定', () => {
		it('Twitter Cardのサイト名に固定値「@Orch_canvas」が設定される', () => {
			// Arrange: テスト用のプロパティ
			const props = defaultProps;

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: Twitter Cardのサイト名に固定値が設定されていることを確認
			const twitterSite = document.querySelector('meta[name="twitter:site"]');
			expect(twitterSite).not.toBeNull();
			expect(twitterSite?.getAttribute('content')).toBe('@Orch_canvas');
		});

		it('Twitter Cardのカードタイプに固定値「summary」が設定される', () => {
			// Arrange: テスト用のプロパティ
			const props = defaultProps;

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: Twitter Cardのカードタイプに固定値が設定されていることを確認
			const twitterCard = document.querySelector('meta[name="twitter:card"]');
			expect(twitterCard).not.toBeNull();
			expect(twitterCard?.getAttribute('content')).toBe('summary');
		});

		it('Twitter CardのタイトルにはfullTitleと同じ値が設定される', () => {
			// Arrange: Twitter Cardのタイトルテスト
			const title = 'テストページ';
			const props = { title, canonical: '/test' };
			const expectedTitle = `${title} - Orchestra Canvas Tokyo`;

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: Twitter Cardのタイトルが正しく設定されていることを確認
			const twitterTitle = document.querySelector('meta[name="twitter:title"]');
			expect(twitterTitle).not.toBeNull();
			expect(twitterTitle?.getAttribute('content')).toBe(expectedTitle);
		});

		it('Twitter Cardの画像URLに固定値が設定される', () => {
			// Arrange: テスト用のプロパティ
			const props = defaultProps;
			const expectedImage = 'https://www.orch-canvas.tokyo/web-app-manifest-512x512.png';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: Twitter Cardの画像URLに固定値が設定されていることを確認
			const twitterImage = document.querySelector('meta[name="twitter:image"]');
			expect(twitterImage).not.toBeNull();
			expect(twitterImage?.getAttribute('content')).toBe(expectedImage);
		});

		it('Twitter Cardの画像代替テキストに固定値が設定される', () => {
			// Arrange: テスト用のプロパティ
			const props = defaultProps;
			const expectedAlt = 'Orchestra Canvas Tokyoのロゴ';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: Twitter Cardの画像代替テキストに固定値が設定されていることを確認
			const twitterImageAlt = document.querySelector('meta[name="twitter:image:alt"]');
			expect(twitterImageAlt).not.toBeNull();
			expect(twitterImageAlt?.getAttribute('content')).toBe(expectedAlt);
		});
	});
});

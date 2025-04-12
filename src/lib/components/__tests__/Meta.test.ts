import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

// グローバルなモック関数を定義
const { mockMetaTagClass, MetaTagsMock } = vi.hoisted(() => {
	const metatagsConstructor = vi.fn();
	return {
		MetaTagsMock: metatagsConstructor,
		// @ts-expect-error 無理やりMockしているので型指定なし
		mockMetaTagClass: function MetaTags(options) {
			metatagsConstructor(options.props);
			return {
				$$: {
					props: options.props,
					fragment: { c: vi.fn(), m: vi.fn(), d: vi.fn() },
					on_mount: [],
					on_destroy: [],
					after_update: []
				}
			};
		}
	};
});

// svelte-meta-tagsのモックを作成
vi.mock('svelte-meta-tags', () => {
	return {
		MetaTags: mockMetaTagClass
	};
});

describe('Meta.svelte', () => {
	// テスト用のデフォルトプロパティ
	const defaultProps = {
		title: 'テストページ',
		canonical: '/test'
	};

	// 各テスト前にモックをリセット
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('基本機能', () => {
		it('MetaTagsコンポーネントを使用し、必要な属性が正しく設定される', () => {
			// Arrange: テスト用のプロパティを準備
			const props = defaultProps;

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: コンポーネントが使用され、基本的な属性が正しく設定されている
			expect(MetaTagsMock).toHaveBeenCalled();
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'テストページ - Orchestra Canvas Tokyo',
					canonical: 'https://www.orch-canvas.tokyo/test',
					twitter: expect.any(Object)
				})
			);
		});
	});

	describe('タイトル生成', () => {
		it('タイトルが空でない場合、「{title} - Orchestra Canvas Tokyo」形式のタイトルが生成される', () => {
			// Arrange: 通常のタイトルのテスト
			const props = { title: 'テストページ', canonical: '/test' };
			const expected = 'テストページ - Orchestra Canvas Tokyo';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: 正しいタイトルが生成されることを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: expected
				})
			);
		});

		it('タイトルが空の場合、「Orchestra Canvas Tokyo」のみが表示される', () => {
			// Arrange: 空のタイトルのテスト
			const props = { title: '', canonical: '/' };
			const expected = 'Orchestra Canvas Tokyo';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: デフォルトのタイトルのみが表示されることを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: expected
				})
			);
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
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: expected
				})
			);
		});

		it('相対パスが/なしの場合、自動的に/が追加される', () => {
			// Arrange: /なしの相対パスのテスト
			const props = { title: 'テスト', canonical: 'test' };
			const expected = 'https://www.orch-canvas.tokyo/test';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: /が自動的に追加されることを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: expected
				})
			);
		});

		it('canonicalが空の場合はベースURLのみとなる', () => {
			// Arrange: 空のcanonicalのテスト
			const props = { title: 'テスト', canonical: '' };
			const expected = 'https://www.orch-canvas.tokyo';

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: ベースURLのみが設定されることを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: expected
				})
			);
		});
	});

	describe('Twitter Card設定', () => {
		it('Twitter Cardに所定の固定値が設定される', () => {
			// Arrange: テスト用のプロパティ
			const props = defaultProps;

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: Twitter Cardに所定の固定値が設定されていることを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.objectContaining({
						site: '@Orch_canvas',
						cardType: 'summary',
						image: 'https://www.orch-canvas.tokyo/web-app-manifest-512x512.png',
						imageAlt: 'Orchestra Canvas Tokyoのロゴ'
					})
				})
			);
		});

		it('Twitter CardのタイトルにはfullTitleと同じ値が設定される', () => {
			// Arrange: Twitter Cardのタイトルテスト
			const title = 'テストページ';
			const props = { title, canonical: '/test' };
			const expectedTitle = `${title} - Orchestra Canvas Tokyo`;

			// Act: コンポーネントをレンダリング
			render(Meta, { props });

			// Assert: Twitter Cardのタイトルが正しく設定されていることを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.objectContaining({
						title: expectedTitle
					})
				})
			);
		});
	});
});

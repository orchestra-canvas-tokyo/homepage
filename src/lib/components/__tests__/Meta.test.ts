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
const { mockMetaTagClass, MetaTagsMock: MetaTagsMock } = vi.hoisted(() => {
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

	describe('基本構造', () => {
		it('[pos] MetaTagsコンポーネントが使用される', () => {
			// 仕様: SEOとソーシャルメディア共有のためにMetaTagsコンポーネントが使用される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントが呼び出されたことを確認
			expect(MetaTagsMock).toHaveBeenCalled();
		});

		it('[pos] title属性が正しく渡される', () => {
			// 仕様: title属性が正しく渡される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントにtitle属性が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: expect.any(String)
				})
			);
		});

		it('[pos] canonical属性が正しく渡される', () => {
			// 仕様: canonical属性が正しく渡される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントにcanonical属性が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: expect.any(String)
				})
			);
		});

		it('[pos] twitter属性が正しく渡される', () => {
			// 仕様: twitter属性が正しく渡される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントにtwitter属性が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.any(Object)
				})
			);
		});
	});

	describe('タイトル生成', () => {
		it('[pos] titleが空でない場合、正しいfullTitleが生成される', () => {
			// 仕様: titleが空でない場合、「{title} - Orchestra Canvas Tokyo」が生成される
			render(Meta, {
				props: {
					title: 'テストページ',
					canonical: '/test'
				}
			});

			// MetaTagsコンポーネントに正しいtitleが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'テストページ - Orchestra Canvas Tokyo'
				})
			);
		});

		it('[pos] titleが空の場合、「Orchestra Canvas Tokyo」のみが表示される', () => {
			// 仕様: titleが空の場合、「Orchestra Canvas Tokyo」のみが表示される
			render(Meta, {
				props: {
					title: '',
					canonical: '/'
				}
			});

			// MetaTagsコンポーネントに正しいtitleが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Orchestra Canvas Tokyo'
				})
			);
		});

		it('[pos] Twitter CardのタイトルもfullTitleと同じ値が設定される', () => {
			// 仕様: Twitter CardのタイトルもfullTitleと同じ値が設定される
			const title = 'テストページ';
			render(Meta, {
				props: {
					title,
					canonical: '/test'
				}
			});

			const expectedFullTitle = `${title} - Orchestra Canvas Tokyo`;

			// MetaTagsコンポーネントに正しいTwitter Cardのタイトルが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: expectedFullTitle,
					twitter: expect.objectContaining({
						title: expectedFullTitle
					})
				})
			);
		});
	});

	describe('正規URL（canonical）の生成', () => {
		it('[pos] canonicalの前に「https://www.orch-canvas.tokyo」が付加される', () => {
			// 仕様: canonicalの前に「https://www.orch-canvas.tokyo」が付加される
			render(Meta, {
				props: {
					title: 'テストページ',
					canonical: '/test'
				}
			});

			// MetaTagsコンポーネントに正しいcanonicalが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: 'https://www.orch-canvas.tokyo/test'
				})
			);
		});

		it('[pos] canonicalが/で始まらない場合でも正しく処理される', () => {
			// 仕様: canonicalが/で始まらない場合でも正しく処理される
			render(Meta, {
				props: {
					title: 'テストページ',
					canonical: 'test'
				}
			});

			// MetaTagsコンポーネントに正しいcanonicalが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: 'https://www.orch-canvas.tokyo/test'
				})
			);
		});

		it('[pos] canonicalが/で終わる場合でも正しく処理される', () => {
			// 仕様: canonicalが/で終わる場合でも正しく処理される
			render(Meta, {
				props: {
					title: 'テストページ',
					canonical: '/test/'
				}
			});

			// MetaTagsコンポーネントに正しいcanonicalが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: 'https://www.orch-canvas.tokyo/test/'
				})
			);
		});
	});

	describe('Twitter Card', () => {
		it('[pos] Twitter Cardのsite属性が正しく設定される', () => {
			// 仕様: Twitter Cardのsite属性が正しく設定される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントに正しいTwitter Cardのsite属性が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.objectContaining({
						site: '@Orch_canvas'
					})
				})
			);
		});

		it('[pos] Twitter CardのcardType属性が正しく設定される', () => {
			// 仕様: Twitter CardのcardType属性が正しく設定される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントに正しいTwitter CardのcardType属性が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.objectContaining({
						cardType: 'summary'
					})
				})
			);
		});

		it('[pos] Twitter Cardのimage属性が正しく設定される', () => {
			// 仕様: Twitter Cardのimage属性が正しく設定される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントに正しいTwitter Cardのimage属性が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.objectContaining({
						image: 'https://www.orch-canvas.tokyo/web-app-manifest-512x512.png'
					})
				})
			);
		});

		it('[pos] Twitter CardのimageAlt属性が正しく設定される', () => {
			// 仕様: Twitter CardのimageAlt属性が正しく設定される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントに正しいTwitter CardのimageAlt属性が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.objectContaining({
						imageAlt: 'Orchestra Canvas Tokyoのロゴ'
					})
				})
			);
		});
	});

	describe('エラー処理と堅牢性', () => {
		it('[neg] titleが指定されない場合でも動作する', () => {
			// 仕様: titleが指定されない場合でも動作する
			render(Meta, {
				props: {
					title: '', // 空文字列を指定
					canonical: '/test'
				}
			});

			// MetaTagsコンポーネントに正しいtitleが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Orchestra Canvas Tokyo'
				})
			);
		});

		it('[neg] canonicalが指定されない場合でも動作する', () => {
			// 仕様: canonicalが指定されない場合でも動作する
			render(Meta, {
				props: {
					title: 'テストページ',
					canonical: '' // 空文字列を指定
				}
			});

			// MetaTagsコンポーネントに正しいcanonicalが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: 'https://www.orch-canvas.tokyo'
				})
			);
		});

		it('[neg] 特殊文字を含むtitleでも正しく処理される', () => {
			// 仕様: 特殊文字を含むtitleでも正しく処理される
			const specialTitle = '<script>alert("XSS")</script>';
			render(Meta, {
				props: {
					title: specialTitle,
					canonical: '/test'
				}
			});

			// MetaTagsコンポーネントに正しいtitleが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: `${specialTitle} - Orchestra Canvas Tokyo`
				})
			);
		});

		it('[neg] 極端に長いtitleでも処理される', () => {
			// 仕様: 極端に長いtitleでも処理される
			const longTitle = 'これは非常に長いタイトルです。'.repeat(10); // 長いタイトル
			render(Meta, {
				props: {
					title: longTitle,
					canonical: '/test'
				}
			});

			// MetaTagsコンポーネントに正しいtitleが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: `${longTitle} - Orchestra Canvas Tokyo`
				})
			);
		});

		it('[neg] 特殊文字を含むcanonicalでも正しく処理される', () => {
			// 仕様: 特殊文字を含むcanonicalでも正しく処理される
			const specialCanonical = '/test?param=value&another=123';
			render(Meta, {
				props: {
					title: 'テストページ',
					canonical: specialCanonical
				}
			});

			// MetaTagsコンポーネントに正しいcanonicalが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: `https://www.orch-canvas.tokyo${specialCanonical}`
				})
			);
		});
	});

	describe('実際の使用パターン', () => {
		it('[pos] トップページの設定', () => {
			// 仕様: トップページの設定
			render(Meta, {
				props: {
					title: '', // トップページは空文字列
					canonical: '/'
				}
			});

			// MetaTagsコンポーネントに正しい設定が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Orchestra Canvas Tokyo',
					canonical: 'https://www.orch-canvas.tokyo/'
				})
			);
		});

		it('[pos] コンサートページの設定', () => {
			// 仕様: コンサートページの設定
			render(Meta, {
				props: {
					title: '第10回定期演奏会',
					canonical: '/concerts/regular10'
				}
			});

			// MetaTagsコンポーネントに正しい設定が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: '第10回定期演奏会 - Orchestra Canvas Tokyo',
					canonical: 'https://www.orch-canvas.tokyo/concerts/regular10'
				})
			);
		});

		it('[pos] お問い合わせページの設定', () => {
			// 仕様: お問い合わせページの設定
			render(Meta, {
				props: {
					title: 'お問い合わせ',
					canonical: '/contact'
				}
			});

			// MetaTagsコンポーネントに正しい設定が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'お問い合わせ - Orchestra Canvas Tokyo',
					canonical: 'https://www.orch-canvas.tokyo/contact'
				})
			);
		});

		it('[pos] 団員募集ページの設定', () => {
			// 仕様: 団員募集ページの設定
			render(Meta, {
				props: {
					title: '団員募集',
					canonical: '/recruit'
				}
			});

			// MetaTagsコンポーネントに正しい設定が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: '団員募集 - Orchestra Canvas Tokyo',
					canonical: 'https://www.orch-canvas.tokyo/recruit'
				})
			);
		});
	});

	// 注: 現在のMetaコンポーネントにはviewport設定が含まれていないため、
	// レスポンシブデザインのテストは省略します。
	// 将来的にviewport設定が追加された場合は、以下のようなテストを追加することを推奨します。
	/*
	describe('レスポンシブデザイン', () => {
		it('[pos] モバイルデバイスを含む全てのデバイスで適切に表示されるためのviewport設定が含まれる', () => {
			// 仕様: モバイルデバイスを含む全てのデバイスで適切に表示されるためのviewport設定が含まれる
			render(Meta, {
				props: defaultProps
			});
			
			// MetaTagsコンポーネントに適切なviewport設定が渡されていることを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					viewport: 'width=device-width, initial-scale=1'
				})
			);
		});
	});
	*/

	describe('SEO対策', () => {
		it('[pos] 正規URLが適切に設定される', () => {
			// 仕様: 正規URLが適切に設定される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントに正しいcanonicalが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					canonical: 'https://www.orch-canvas.tokyo/test'
				})
			);
		});

		it('[pos] タイトルが適切に設定される', () => {
			// 仕様: タイトルが適切に設定される
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントに正しいtitleが渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'テストページ - Orchestra Canvas Tokyo'
				})
			);
		});

		it('[pos] ソーシャルメディア共有のための設定が適切に行われる', () => {
			// 仕様: ソーシャルメディア共有のための設定が適切に行われる
			render(Meta, {
				props: defaultProps
			});

			// MetaTagsコンポーネントに正しいTwitter Cardの設定が渡されたことを確認
			expect(MetaTagsMock).toHaveBeenCalledWith(
				expect.objectContaining({
					twitter: expect.objectContaining({
						site: '@Orch_canvas',
						cardType: 'summary',
						image: expect.any(String),
						imageAlt: expect.any(String)
					})
				})
			);
		});
	});
});

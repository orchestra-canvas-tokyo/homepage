import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Flyer from '../Flyer.svelte';

/**
 * Flyerコンポーネントの仕様：
 *
 * 1. 基本構造と目的
 *   - 画像を表示するためのコンポーネント
 *   - imgタグを使用して画像を表示する
 *   - Cloudflare Imagesを使用するかどうかによって表示方法が変わる
 *
 * 2. プロパティ
 *   - src: 画像のURL（必須）
 *   - alt: 画像の代替テキスト（必須）
 *   - lazy: 遅延読み込みを有効にするかどうか（オプション、デフォルトはfalse）
 *
 * 3. Cloudflare Images対応
 *   - ホスト名が'www.orch-canvas.tokyo'の場合、Cloudflare Imagesを使用する
 *   - Cloudflare Imagesを使用する場合、srcとsrcsetが適切に設定される
 *   - Cloudflare Imagesを使用しない場合、通常のimgタグが表示される
 *   - Cloudflare Imagesを使用する場合、以下のオプションが設定される：
 *     - format=auto: 最適なフォーマットで画像を提供
 *     - fit=scale-down: 画像のアスペクト比を維持しながらサイズを調整
 *     - height=1920: 基本の高さを1920pxに設定
 *     - srcsetで2xの解像度も提供（height=3840）
 *
 * 4. 遅延読み込み
 *   - lazyがtrueの場合、loading="lazy"属性が設定される
 *   - lazyがfalseの場合、loading属性は設定されない
 *
 * 5. アクセシビリティ対応
 *   - alt属性が必須で、スクリーンリーダーでの画像の説明に使用される
 *   - 画像が装飾的な場合でも、空のalt属性を設定する必要がある
 *
 * 6. パス処理
 *   - 相対パス（'/'で始まる）と絶対パス（URLなど）の両方をサポート
 *   - 相対パスの場合、先頭の'/'を除去してCloudflare Images用のURLを生成
 */

describe('Flyer.svelte', () => {
	// windowのlocationをモック化するための準備
	const originalLocation = window.location;

	beforeEach(() => {
		// windowのlocationをモック化（デフォルトはlocalhost）
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				...originalLocation,
				href: 'http://localhost:3000',
				hostname: 'localhost'
			}
		});
	});

	afterEach(() => {
		// テスト後に元に戻す
		Object.defineProperty(window, 'location', {
			writable: true,
			value: originalLocation
		});
	});

	// Cloudflare Imagesのホスト名に設定するヘルパー関数
	const setCloudflareHostname = () => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				...originalLocation,
				href: 'https://www.orch-canvas.tokyo/',
				hostname: 'www.orch-canvas.tokyo'
			}
		});
	};

	describe('基本構造', () => {
		it('[pos] imgタグが正しく表示される', () => {
			// 仕様: Flyerコンポーネントはimgタグを使用して画像を表示する
			const { container } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: 'テスト画像'
				}
			});

			const img = container.querySelector('img');
			expect(img).not.toBeNull();
			expect(img?.tagName).toBe('IMG');
		});

		it('[pos] 画像のみが表示され、余分な要素は含まれない', () => {
			// 仕様: Flyerコンポーネントは画像のみを表示し、余分な要素は含まれない
			const { container } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: 'テスト画像'
				}
			});

			// imgタグ以外の要素がないことを確認
			expect(container.childElementCount).toBe(1);
			expect(container.firstElementChild?.tagName).toBe('IMG');
		});
	});

	describe('プロパティ', () => {
		it('[pos] src属性が正しく設定される', () => {
			// 仕様: src属性が正しく設定される
			const src = '/test-image.jpg';
			const { container } = render(Flyer, {
				props: {
					src,
					alt: 'テスト画像'
				}
			});

			const img = container.querySelector('img');
			expect(img?.getAttribute('src')).toBe(src);
		});

		it('[pos] alt属性が正しく設定される', () => {
			// 仕様: alt属性が正しく設定される
			const alt = 'テスト画像';
			const { container } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt
				}
			});

			const img = container.querySelector('img');
			expect(img?.getAttribute('alt')).toBe(alt);
		});

		it('[pos] lazyがtrueの場合、loading="lazy"属性が設定される', () => {
			// 仕様: lazyがtrueの場合、loading="lazy"属性が設定される
			const { container } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: 'テスト画像',
					lazy: true
				}
			});

			const img = container.querySelector('img');
			expect(img?.getAttribute('loading')).toBe('lazy');
		});

		it('[pos] lazyがfalseまたは指定されない場合、loading属性は設定されない', () => {
			// 仕様: lazyがfalseまたは指定されない場合、loading属性は設定されない
			// lazyがfalseの場合
			const { container: container1 } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: 'テスト画像',
					lazy: false
				}
			});
			expect(container1.querySelector('img')?.getAttribute('loading')).toBeNull();

			// lazyが指定されない場合（デフォルトはfalse）
			const { container: container2 } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: 'テスト画像'
				}
			});
			expect(container2.querySelector('img')?.getAttribute('loading')).toBeNull();
		});
	});

	describe('Cloudflare Images対応', () => {
		it('[pos] 通常のホスト名の場合、通常のimgタグが表示される', () => {
			// 仕様: ホスト名が'www.orch-canvas.tokyo'以外の場合、通常のimgタグが表示される
			const src = '/test-image.jpg';
			const { container } = render(Flyer, {
				props: {
					src,
					alt: 'テスト画像'
				}
			});

			const img = container.querySelector('img');
			expect(img?.getAttribute('src')).toBe(src);
			expect(img?.hasAttribute('srcset')).toBe(false);
		});

		it('[pos] orch-canvas.tokyoのホスト名の場合、Cloudflare Images用のURLが設定される', async () => {
			// 仕様: ホスト名が'www.orch-canvas.tokyo'の場合、Cloudflare Images用のURLが設定される
			setCloudflareHostname();

			const src = '/test-image.jpg';
			const { container } = render(Flyer, {
				props: {
					src,
					alt: 'テスト画像'
				}
			});

			// onMountの実行を待つためにタイマーを進める
			await vi.dynamicImportSettled();

			const img = container.querySelector('img');
			const srcAttr = img?.getAttribute('src') || '';

			// Cloudflare Images用のURLが設定されていることを確認
			expect(srcAttr).toContain('https://www.orch-canvas.tokyo/cdn-cgi/image/');

			// 必要なオプションがすべて含まれていることを確認
			expect(srcAttr).toContain('format=auto');
			expect(srcAttr).toContain('fit=scale-down');
			expect(srcAttr).toContain('height=1920');
			expect(srcAttr).toContain('test-image.jpg');

			// srcsetも設定されていることを確認
			const srcsetAttr = img?.getAttribute('srcset') || '';
			expect(srcsetAttr).toContain('2x');
			expect(srcsetAttr).toContain('height=3840');
		});

		it('[neg] 相対パスでないsrcが指定された場合も正しく処理される', async () => {
			// 仕様: 相対パスでないsrcが指定された場合も正しく処理される
			setCloudflareHostname();

			const src = 'https://example.com/test-image.jpg';
			const { container } = render(Flyer, {
				props: {
					src,
					alt: 'テスト画像'
				}
			});

			// onMountの実行を待つためにタイマーを進める
			await vi.dynamicImportSettled();

			const img = container.querySelector('img');
			const srcAttr = img?.getAttribute('src') || '';

			// 外部URLがそのまま使用されていることを確認
			expect(srcAttr).toContain('https://www.orch-canvas.tokyo/cdn-cgi/image/');
			expect(srcAttr).toContain('https://example.com/test-image.jpg');
		});

		it('[pos] 相対パスの場合、先頭の/が除去されてCloudflare Images用のURLが生成される', async () => {
			// 仕様: 相対パスの場合、先頭の/が除去されてCloudflare Images用のURLが生成される
			setCloudflareHostname();

			const src = '/path/to/image.jpg';
			const { container } = render(Flyer, {
				props: {
					src,
					alt: 'テスト画像'
				}
			});

			// onMountの実行を待つためにタイマーを進める
			await vi.dynamicImportSettled();

			const img = container.querySelector('img');
			const srcAttr = img?.getAttribute('src') || '';

			// 先頭の/が除去されていることを確認
			expect(srcAttr).not.toContain('//path/to/image.jpg');
			expect(srcAttr).toContain('/path/to/image.jpg');
		});
	});

	describe('エラー処理と堅牢性', () => {
		it('[neg] srcが空文字列でも表示できる', () => {
			// 仕様: srcが空文字列でも正常に表示される
			const { container } = render(Flyer, {
				props: {
					src: '',
					alt: 'テスト画像'
				}
			});

			const img = container.querySelector('img');
			expect(img).not.toBeNull();
			// 空文字列のsrcは実際にはnullとして扱われる
			expect(img?.getAttribute('src')).toBeNull();
		});

		it('[neg] altが空文字列でも表示できる', () => {
			// 仕様: altが空文字列でも正常に表示される
			const { container } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: ''
				}
			});

			const img = container.querySelector('img');
			expect(img).not.toBeNull();
			expect(img?.getAttribute('alt')).toBe('');
		});

		it('[neg] 特殊文字を含むURLでも正しく処理される', () => {
			// 仕様: 特殊文字を含むURLでも正しく処理される
			const src = '/test image with spaces.jpg?param=value&another=123';
			const { container } = render(Flyer, {
				props: {
					src,
					alt: 'テスト画像'
				}
			});

			const img = container.querySelector('img');
			expect(img?.getAttribute('src')).toBe(src);
		});

		it('[neg] 極端に長いURLでも表示できる', () => {
			// 仕様: 極端に長いURLでも正常に表示される
			const longSrc =
				'/very/long/path/to/image/with/many/nested/directories/and/a/very/long/filename/that/exceeds/normal/length/limitations/but/should/still/work/properly/without/any/issues/or/errors/test-image.jpg';
			const { container } = render(Flyer, {
				props: {
					src: longSrc,
					alt: 'テスト画像'
				}
			});

			const img = container.querySelector('img');
			expect(img?.getAttribute('src')).toBe(longSrc);
		});

		it('[neg] HTMLタグを含むalt属性でもエスケープされて表示される', () => {
			// 仕様: HTMLタグを含むalt属性でもエスケープされて安全に表示される
			const altWithHtml = '<script>alert("XSS")</script>';
			const { container } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: altWithHtml
				}
			});

			const img = container.querySelector('img');
			expect(img?.getAttribute('alt')).toBe(altWithHtml);
			// 実際にスクリプトタグが生成されていないことを確認
			expect(container.querySelector('script')).toBeNull();
		});
	});

	describe('アクセシビリティ対応', () => {
		it('[pos] alt属性が設定され、スクリーンリーダーで認識できる', () => {
			// 仕様: alt属性が設定され、スクリーンリーダーで認識できる
			const alt = 'アクセシビリティテスト画像';
			render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt
				}
			});

			// alt属性を持つ要素が存在することを確認（screen.getByAltTextを使用）
			const img = screen.getByAltText(alt);
			expect(img).toBeInTheDocument();
			expect(img.tagName).toBe('IMG');
		});

		it('[pos] 装飾的な画像の場合でも空のalt属性が設定される', () => {
			// 仕様: 装飾的な画像の場合でも空のalt属性が設定される
			const { container } = render(Flyer, {
				props: {
					src: '/decorative-image.jpg',
					alt: ''
				}
			});

			const img = container.querySelector('img');
			expect(img?.hasAttribute('alt')).toBe(true);
			expect(img?.getAttribute('alt')).toBe('');
		});
	});

	describe('実際の使用パターン', () => {
		it('[pos] コンサートフライヤーの表示（Cloudflare Images + 遅延読み込み）', async () => {
			// 仕様: 典型的な使用パターン - コンサートフライヤーの表示
			setCloudflareHostname();

			const { container } = render(Flyer, {
				props: {
					src: '/concerts/regular/images/flyers/regular-1.webp',
					alt: '第1回定期演奏会フライヤー',
					lazy: true
				}
			});

			// onMountの実行を待つためにタイマーを進める
			await vi.dynamicImportSettled();

			const img = container.querySelector('img');

			// Cloudflare Images用のURLが設定されていることを確認
			expect(img?.getAttribute('src')).toContain('https://www.orch-canvas.tokyo/cdn-cgi/image/');
			expect(img?.getAttribute('src')).toContain('concerts/regular/images/flyers/regular-1.webp');

			// lazy属性が設定されていることを確認
			expect(img?.getAttribute('loading')).toBe('lazy');

			// alt属性が正しく設定されていることを確認
			expect(img?.getAttribute('alt')).toBe('第1回定期演奏会フライヤー');
		});

		it('[pos] 異なる画像フォーマットの表示', () => {
			// 仕様: 異なる画像フォーマット（webp, png, jpg）でも正しく表示される
			const formats = [
				{ src: '/test-image.webp', alt: 'WebP画像' },
				{ src: '/test-image.png', alt: 'PNG画像' },
				{ src: '/test-image.jpg', alt: 'JPG画像' }
			];

			for (const format of formats) {
				const { container } = render(Flyer, {
					props: {
						src: format.src,
						alt: format.alt
					}
				});

				const img = container.querySelector('img');
				expect(img?.getAttribute('src')).toBe(format.src);
				expect(img?.getAttribute('alt')).toBe(format.alt);
			}
		});

		it('[pos] レスポンシブ対応のための高解像度画像の提供', async () => {
			// 仕様: Cloudflare Images使用時に高解像度画像（2x）が提供される
			setCloudflareHostname();

			const { container } = render(Flyer, {
				props: {
					src: '/test-image.jpg',
					alt: 'レスポンシブテスト画像'
				}
			});

			// onMountの実行を待つためにタイマーを進める
			await vi.dynamicImportSettled();

			const img = container.querySelector('img');

			// srcsetが設定されていることを確認
			const srcset = img?.getAttribute('srcset') || '';
			expect(srcset).toContain('2x');
			expect(srcset).toContain('height=3840');
		});
	});
});

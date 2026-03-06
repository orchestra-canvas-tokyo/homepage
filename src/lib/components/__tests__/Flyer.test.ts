import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
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
	it('画像を表示するためのimgタグが生成される', () => {
		// Arrange: テスト用のデータを準備
		const src = '/test-image.jpg';
		const alt = 'テスト画像';

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, {
			props: { src, alt }
		});

		// Assert: imgタグが存在し、正しい属性を持つことを確認
		const img = container.querySelector('img');
		expect(img).not.toBeNull();
		expect(img?.tagName).toBe('IMG');
		expect(img?.getAttribute('src')).toBe(src);
		expect(img?.getAttribute('alt')).toBe(alt);

		// 余分な要素を含まないシンプルな構造であることを確認
		expect(container.childElementCount).toBe(1);
		expect(container.firstElementChild?.tagName).toBe('DIV');
	});
});

describe('遅延読み込み機能', () => {
	it('lazyがtrueの場合、loading="lazy"属性が設定される', () => {
		// Arrange: lazy=trueを指定
		const props = {
			src: '/test-image.jpg',
			alt: 'テスト画像',
			lazy: true
		};

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, { props });

		// Assert: loading="lazy"属性が設定されていることを確認
		const img = container.querySelector('img');
		expect(img?.getAttribute('loading')).toBe('lazy');
	});

	it('lazyがfalseの場合、loading属性は設定されない', () => {
		// Arrange: lazy=falseを指定
		const props = {
			src: '/test-image.jpg',
			alt: 'テスト画像',
			lazy: false
		};

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, { props });

		// Assert: loading属性がないことを確認
		const img = container.querySelector('img');
		expect(img?.getAttribute('loading')).toBeNull();
	});

	it('lazyが省略された場合（デフォルト値）、loading属性は設定されない', () => {
		// Arrange: lazyを省略
		const props = {
			src: '/test-image.jpg',
			alt: 'テスト画像'
			// lazyは省略（デフォルトはfalse）
		};

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, { props });

		// Assert: loading属性がないことを確認（デフォルトでfalseと同様の挙動）
		const img = container.querySelector('img');
		expect(img?.getAttribute('loading')).toBeNull();
	});
});

describe('Cloudflare Images対応', () => {
	it('通常のホスト名の場合、srcのみが設定される', () => {
		// Arrange: 通常のホスト名でのテスト
		const src = '/test-image.jpg';
		const alt = 'テスト画像';

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, {
			props: { src, alt }
		});

		// Assert: 通常のsrcのみが設定されていることを確認
		const img = container.querySelector('img');
		expect(img?.getAttribute('src')).toBe(src);
		expect(img?.hasAttribute('srcset')).toBe(false);
	});

	it('Cloudflareホスト名で遅延読み込みが有効の場合、loading="lazy"属性が設定される', async () => {
		// Arrange: Cloudflareのホスト名に設定し、lazy=trueを指定
		setCloudflareHostname();
		const props = {
			src: '/test-image.jpg',
			alt: 'テスト画像',
			lazy: true
		};

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, { props });

		// Assert: loading="lazy"属性が設定されていることを確認
		const img = container.querySelector('img');
		expect(img?.getAttribute('loading')).toBe('lazy');
	});

	it('Cloudflareホスト名の場合、Cloudflare Images用のURLが設定される', async () => {
		// Arrange: Cloudflareのホスト名に設定
		setCloudflareHostname();
		const src = '/test-image.jpg';

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, {
			props: { src, alt: 'テスト画像' }
		});

		// Assert: Cloudflare Images用のURLが設定されていることを確認
		const img = container.querySelector('img');
		const srcAttr = img?.getAttribute('src') || '';

		// Cloudflare Images用のURLが設定されていることを確認
		expect(srcAttr).toContain('https://www.orch-canvas.tokyo/cdn-cgi/image/');
		expect(srcAttr).toContain('format=auto');
		expect(srcAttr).toContain('fit=scale-down');
		expect(srcAttr).toContain('height=1920');

		// srcsetも設定されていることを確認
		const srcsetAttr = img?.getAttribute('srcset') || '';
		expect(srcsetAttr).toContain('2x');
		expect(srcsetAttr).toContain('height=3840');
	});

	it('相対パスの場合、先頭の/が除去される', async () => {
		// Arrange: Cloudflareのホスト名と相対パスを設定
		setCloudflareHostname();
		const src = '/path/to/image.jpg';
		const expectedSrc =
			'https://www.orch-canvas.tokyo/cdn-cgi/image/format=auto,fit=scale-down,height=1920/path/to/image.jpg';

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, {
			props: { src, alt: 'テスト画像' }
		});

		// Assert: 先頭の/が除去された正確なURLが設定されていることを確認
		const img = container.querySelector('img');
		const srcAttr = img?.getAttribute('src') || '';
		expect(srcAttr).toBe(expectedSrc);
	});

	it('スラッシュで始まらない相対パスも適切に処理される', async () => {
		// Arrange: Cloudflareのホスト名と先頭にスラッシュがない相対パスを設定
		setCloudflareHostname();
		const src = 'path/to/image.jpg';
		const expectedSrc =
			'https://www.orch-canvas.tokyo/cdn-cgi/image/format=auto,fit=scale-down,height=1920/path/to/image.jpg';

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, {
			props: { src, alt: 'テスト画像' }
		});

		// Assert: 正確なURLが設定されていることを確認
		const img = container.querySelector('img');
		const srcAttr = img?.getAttribute('src') || '';
		expect(srcAttr).toBe(expectedSrc);
	});
});

describe('アクセシビリティ対応', () => {
	it('alt属性が設定され、スクリーンリーダーで認識できる', () => {
		// Arrange: alt属性を設定
		const alt = 'アクセシビリティテスト画像';

		// Act: コンポーネントをレンダリング
		render(Flyer, {
			props: {
				src: '/test-image.jpg',
				alt
			}
		});

		// Assert: alt属性を持つ要素が存在することを確認
		const img = screen.getByAltText(alt);
		expect(img).toBeInTheDocument();
		expect(img.tagName).toBe('IMG');
	});

	it('装飾的な画像の場合でも空のalt属性が設定される', () => {
		// Arrange: 空のalt属性を設定
		const alt = '';

		// Act: コンポーネントをレンダリング
		const { container } = render(Flyer, {
			props: {
				src: '/decorative-image.jpg',
				alt
			}
		});

		// Assert: 空のalt属性が設定されていることを確認
		const img = container.querySelector('img');
		expect(img?.hasAttribute('alt')).toBe(true);
		expect(img?.getAttribute('alt')).toBe('');
	});
});

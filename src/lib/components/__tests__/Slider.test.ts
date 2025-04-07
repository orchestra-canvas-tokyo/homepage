import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Slider from '../Slider.svelte';
import type { Slide } from '../Slider.svelte';

/**
 * Sliderコンポーネントの仕様：
 *
 * 1. 基本構造と目的
 *   - スライダーを表示するためのコンポーネント
 *   - Swiperライブラリを使用
 *   - 画像スライドショーを表示する
 *   - swiper-containerとswiper-slideを使用
 *
 * 2. プロパティ
 *   - slides: スライドの配列（必須）
 *     - src: 画像のURL
 *     - alt: 画像の代替テキスト
 *
 * 3. 子コンポーネント
 *   - Flyerコンポーネントを使用して画像を表示
 *   - 最初のスライド以外はlazyロードを適用
 *
 * 4. スタイル
 *   - スライドは中央に配置される
 *   - ナビゲーションボタンにはドロップシャドウが適用される
 *   - ナビゲーションボタンの色はCSS変数（--main-color）を使用
 *
 * 5. 機能
 *   - centered-slides属性が設定され、スライドが中央に表示される
 *   - navigation属性が設定され、ナビゲーションボタンが表示される
 *   - effect="flip"属性が設定され、フリップエフェクトが適用される
 */

// グローバルなモック関数を定義
const { flyerMockClass, flyerMock } = vi.hoisted(() => {
	const flyerConstructor = vi.fn();
	return {
		flyerMock: flyerConstructor,
		// @ts-expect-error 無理やりMockしているので型指定なし
		flyerMockClass: function Flyer(options) {
			flyerConstructor(options.props);
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

// Flyer コンポーネントのモック
vi.mock('../Flyer.svelte', () => {
	return {
		default: flyerMockClass
	};
});

// Swiperのモック
vi.mock('swiper/element/bundle', () => {
	return {
		register: vi.fn()
	};
});

describe('Slider.svelte', () => {
	// テスト用のスライドデータ
	const testSlides: Slide[] = [
		{ src: '/test-image-1.jpg', alt: 'テスト画像1' },
		{ src: '/test-image-2.jpg', alt: 'テスト画像2' },
		{ src: '/test-image-3.jpg', alt: 'テスト画像3' }
	];

	beforeEach(() => {
		// モックをリセット
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('基本構造', () => {
		it('[pos] swiper-containerとswiper-slideが正しく表示される', () => {
			// 仕様: swiper-containerとswiper-slideが表示される
			const { container } = render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// swiper-containerが存在することを確認
			expect(container.innerHTML).toContain('swiper-container');

			// swiper-slideが各スライド分存在することを確認
			const slideMatches = container.innerHTML.match(/<(?!\/)swiper-slide\b/g);
			expect(slideMatches).not.toBeNull();
			expect(slideMatches?.length).toBe(testSlides.length);
		});

		it('[pos] swiper-containerに必要な属性が設定されている', () => {
			// 仕様: swiper-containerに必要な属性が設定されている
			const { container } = render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// swiper-containerの属性を確認
			const html = container.innerHTML;
			expect(html).toContain('centered-slides="true"');
			expect(html).toContain('navigation="true"');
			expect(html).toContain('effect="flip"');
		});
	});

	describe('プロパティ', () => {
		it('[pos] slidesプロパティが正しく適用される', () => {
			// 仕様: slidesプロパティが正しく適用される
			render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// 各スライドに対応するFlyerコンポーネントが呼び出されたことを確認
			expect(flyerMock).toHaveBeenCalledTimes(testSlides.length);

			// 各スライドのsrcとaltが正しく渡されていることを確認
			testSlides.forEach((slide, index) => {
				expect(flyerMock).toHaveBeenNthCalledWith(
					index + 1,
					expect.objectContaining({
						src: slide.src,
						alt: slide.alt
					})
				);
			});
		});
	});

	describe('子コンポーネント', () => {
		it('[pos] Flyerコンポーネントが各スライドに対して使用される', () => {
			// 仕様: Flyerコンポーネントが各スライドに対して使用される
			render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// Flyerコンポーネントが呼び出されたことを確認
			expect(flyerMock).toHaveBeenCalled();
			expect(flyerMock).toHaveBeenCalledTimes(testSlides.length);
		});

		it('[pos] 最初のスライド以外はlazyロードが適用される', () => {
			// 仕様: 最初のスライド以外はlazyロードが適用される
			render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// 最初のスライドはlazyロードが適用されないことを確認
			expect(flyerMock).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					lazy: false
				})
			);

			// 2番目以降のスライドはlazyロードが適用されることを確認
			for (let i = 1; i < testSlides.length; i++) {
				expect(flyerMock).toHaveBeenNthCalledWith(
					i + 1,
					expect.objectContaining({
						lazy: true
					})
				);
			}
		});
	});

	describe('スタイル', () => {
		it('[pos] スライドは中央に配置される', () => {
			// 仕様: スライドは中央に配置される
			const { container } = render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// swiper-containerにcentered-slides="true"属性が設定されていることを確認
			expect(container.innerHTML).toContain('centered-slides="true"');
		});

		it('[pos] ナビゲーションボタンが表示される', () => {
			// 仕様: ナビゲーションボタンが表示される
			const { container } = render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// swiper-containerにnavigation="true"属性が設定されていることを確認
			expect(container.innerHTML).toContain('navigation="true"');
		});
	});

	describe('エラー処理と堅牢性', () => {
		it('[neg] 空のスライド配列でも動作する', () => {
			// 仕様: 空のスライド配列でも正常に表示される
			const { container } = render(Slider, {
				props: {
					slides: []
				}
			});

			// swiper-containerが存在することを確認
			expect(container.innerHTML).toContain('swiper-container');

			// swiper-slideが存在しないことを確認
			const slideMatches = container.innerHTML.match(/swiper-slide/g);
			expect(slideMatches).toBeNull();
		});

		it('[neg] 1つのスライドでも正常に動作する', () => {
			// 仕様: 1つのスライドでも正常に動作する
			const singleSlide = [testSlides[0]];
			const { container } = render(Slider, {
				props: {
					slides: singleSlide
				}
			});

			// swiper-containerが存在することを確認
			expect(container.innerHTML).toContain('swiper-container');

			// swiper-slideが1つ存在することを確認
			const slideMatches = container.innerHTML.match(/<(?!\/)swiper-slide\b/g);
			expect(slideMatches).not.toBeNull();
			expect(slideMatches?.length).toBe(1);

			// Flyerコンポーネントが1回呼び出されたことを確認
			expect(flyerMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('実際の使用パターン', () => {
		it('[pos] コンサートフライヤーのスライドショー', () => {
			// 仕様: コンサートフライヤーのスライドショー
			const concertSlides: Slide[] = [
				{ src: '/concerts/regular/images/flyers/regular-1.webp', alt: '第1回定期演奏会フライヤー' },
				{ src: '/concerts/regular/images/flyers/regular-2.webp', alt: '第2回定期演奏会フライヤー' },
				{ src: '/concerts/regular/images/flyers/regular-3.webp', alt: '第3回定期演奏会フライヤー' }
			];

			render(Slider, {
				props: {
					slides: concertSlides
				}
			});

			// Flyerコンポーネントが各スライド分呼び出されたことを確認
			expect(flyerMock).toHaveBeenCalledTimes(concertSlides.length);

			// 各スライドのsrcとaltが正しく渡されていることを確認
			concertSlides.forEach((slide, index) => {
				expect(flyerMock).toHaveBeenNthCalledWith(
					index + 1,
					expect.objectContaining({
						src: slide.src,
						alt: slide.alt
					})
				);
			});

			// 最初のスライドはlazyロードが適用されないことを確認
			expect(flyerMock).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					lazy: false
				})
			);

			// 2番目以降のスライドはlazyロードが適用されることを確認
			for (let i = 1; i < concertSlides.length; i++) {
				expect(flyerMock).toHaveBeenNthCalledWith(
					i + 1,
					expect.objectContaining({
						lazy: true
					})
				);
			}
		});

		it('[pos] 複数の画像フォーマットを含むスライドショー', () => {
			// 仕様: 複数の画像フォーマットを含むスライドショー
			const mixedFormatSlides: Slide[] = [
				{ src: '/test-image-1.webp', alt: 'WebP画像' },
				{ src: '/test-image-2.png', alt: 'PNG画像' },
				{ src: '/test-image-3.jpg', alt: 'JPG画像' }
			];

			render(Slider, {
				props: {
					slides: mixedFormatSlides
				}
			});

			// Flyerコンポーネントが各スライド分呼び出されたことを確認
			expect(flyerMock).toHaveBeenCalledTimes(mixedFormatSlides.length);

			// 各スライドのsrcとaltが正しく渡されていることを確認
			mixedFormatSlides.forEach((slide, index) => {
				expect(flyerMock).toHaveBeenNthCalledWith(
					index + 1,
					expect.objectContaining({
						src: slide.src,
						alt: slide.alt
					})
				);
			});
		});
	});

	describe('パフォーマンス最適化', () => {
		it('[pos] 最初のスライド以外はlazyロードが適用される', () => {
			// 仕様: 最初のスライド以外はlazyロードが適用される
			const { container } = render(Slider, {
				props: {
					slides: testSlides
				}
			});

			// swiper-slideタグを取得
			const html = container.innerHTML;

			// 最初のスライドにはlazy="false"属性が設定されていることを確認
			expect(html).toContain('lazy="false"');

			// 2番目以降のスライドにはlazy="true"属性が設定されていることを確認
			expect(html).toContain('lazy="true"');
		});
	});
});

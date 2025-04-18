import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Slider from '../Slider.svelte';
import type { Slide } from '../Slider.svelte';

/**
 * Sliderコンポーネントの仕様：
 *
 * 1. 基本機能
 *   - 複数の画像をスライドショー形式で表示する
 *   - Swiperライブラリを使用したスライダーを実装
 *
 * 2. プロパティ
 *   - slides: スライドの配列（必須）
 *     - src: 画像のURL
 *     - alt: 画像の代替テキスト
 *
 * 3. パフォーマンス最適化
 *   - 最初のスライドは即時表示（lazy=false）
 *   - 2番目以降のスライドはlazyロード（lazy=true）を適用
 */

// 外部ライブラリのSwiperのみモック
vi.mock('swiper/element/bundle', () => {
	return {
		register: vi.fn()
	};
});

// テスト用のスライドデータ
const testSlides: Slide[] = [
	{ src: '/test-image-1.jpg', alt: 'テスト画像1' },
	{ src: '/test-image-2.jpg', alt: 'テスト画像2' },
	{ src: '/test-image-3.jpg', alt: 'テスト画像3' }
];

describe('基本機能', () => {
	it('スライドデータに基づいて正しい数のスライドが表示される', () => {
		// Arrange: テスト用のスライドデータを準備

		// Act: コンポーネントをレンダリング
		const { container } = render(Slider, {
			props: {
				slides: testSlides
			}
		});

		// Assert: スライドが正しい数だけ表示されていることを確認
		const slideElements = container.querySelectorAll('swiper-slide');
		expect(slideElements.length).toBe(testSlides.length);
	});
});

describe('スライドデータの処理', () => {
	it('各スライドに正しいsrcとalt属性が順番通りに適用される', () => {
		// Arrange: テスト用のスライドデータを準備

		// Act: コンポーネントをレンダリング
		const { container } = render(Slider, {
			props: {
				slides: testSlides
			}
		});

		// Assert: 各スライド要素内のコンテンツが正しい順序で表示されていることを確認
		const slideElements = container.querySelectorAll('swiper-slide');

		// スライド数が正しいことを確認
		expect(slideElements.length).toBe(testSlides.length);

		// 各スライドの内容を順番に検証
		slideElements.forEach((slideElement, index) => {
			const slideHtml = slideElement.innerHTML;
			const expectedSlide = testSlides[index];

			// 各スライドの内容に対応するsrcとaltが含まれていることを確認
			expect(slideHtml).toContain(expectedSlide.src);
			expect(slideHtml).toContain(expectedSlide.alt);
		});
	});
});

describe('lazyロード機能', () => {
	it('最初のスライドは即時ロード、2番目以降はlazyロードが適用される', () => {
		// Arrange: テスト用のスライドデータを準備

		// Act: コンポーネントをレンダリング
		const { container } = render(Slider, {
			props: {
				slides: testSlides
			}
		});

		// Assert: スライド要素のlazy属性を確認
		const slideElements = container.querySelectorAll('swiper-slide');

		// 最初のスライドは lazy="false" または lazy 属性なし
		const firstSlideHtml = slideElements[0].outerHTML;
		expect(
			firstSlideHtml.includes('lazy="false"') || !firstSlideHtml.includes('lazy=')
		).toBeTruthy();

		// 2番目以降のスライドは lazy="true"
		for (let i = 1; i < slideElements.length; i++) {
			expect(slideElements[i].outerHTML).toContain('lazy="true"');
		}
	});
});

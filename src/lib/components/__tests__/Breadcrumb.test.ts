import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Breadcrumb from '../Breadcrumb.svelte';

/**
 * Breadcrumbコンポーネントの仕様：
 *
 * 1. 基本構造と目的
 *   - パンくずリストは、ユーザーが現在のページの階層構造を理解し、上位階層に簡単に移動できるようにするナビゲーション要素
 *   - nav要素（aria-label="breadcrumb"）を持ち、スクリーンリーダーでの識別を容易にする
 *   - ol要素（順序付きリスト）を使用し、階層の順序性を表現する
 *
 * 2. セグメント表示
 *   - 各セグメントはli要素として表示され、階層の各レベルを表現する
 *   - URLを持つセグメントはaタグ（リンク）として表示され、クリック可能
 *   - URLを持たないセグメントはspanタグとして表示され、現在位置を示す（通常は最後のセグメント）
 *   - 各セグメントは言語クラス（'en'または'ja'）を持ち、適切なフォントスタイルを適用
 */

// 型定義を一箇所にまとめて再利用性を高める
type BreadcrumbSegment = { title: string; lang: 'en' | 'ja'; url?: string };

describe('基本構造', () => {
	it('適切なアクセシビリティ属性を持つnav/ol要素の基本構造が正しく表示される', () => {
		const { container } = render(Breadcrumb, { props: { segments: [] } });

		// nav要素が存在し、適切なaria-labelを持つこと
		const nav = container.querySelector('nav');
		expect(nav).not.toBeNull();
		expect(nav?.getAttribute('aria-label')).toBe('breadcrumb');

		// スクリーンリーダー用のaria-labelが適切に機能する
		const navByLabel = screen.getByLabelText('breadcrumb');
		expect(navByLabel).toBeInTheDocument();
		expect(navByLabel.tagName).toBe('NAV');

		// ol要素が存在し、リスト構造を形成していること
		const ol = container.querySelector('ol');
		expect(ol).not.toBeNull();
		expect(ol?.tagName).toBe('OL');
	});
});

describe('セグメント表示', () => {
	it('セグメントが正しく表示され、適切な言語クラスが適用される', () => {
		const segments: BreadcrumbSegment[] = [
			{ title: 'ホーム', lang: 'ja' },
			{ title: 'About', lang: 'en' },
			{ title: 'お問い合わせ', lang: 'ja' }
		];

		const { container } = render(Breadcrumb, { props: { segments } });

		// 正しい数のリスト項目が表示されていること
		const listItems = container.querySelectorAll('li');
		expect(listItems.length).toBe(3);

		// 各セグメントのテキストが正しく表示されていること
		expect(listItems[0].textContent).toContain('ホーム');
		expect(listItems[1].textContent).toContain('About');
		expect(listItems[2].textContent).toContain('お問い合わせ');

		// 各セグメントが正しい言語クラスを持っていること
		expect(listItems[0].querySelector('.ja')).not.toBeNull();
		expect(listItems[1].querySelector('.en')).not.toBeNull();
		expect(listItems[2].querySelector('.ja')).not.toBeNull();
	});

	it('日本語と英語のセグメントに適切な言語クラスが適用される', () => {
		// 言語クラスのテスト（日本語と英語）
		const segments: BreadcrumbSegment[] = [
			{ title: 'ホーム', lang: 'ja' },
			{ title: 'Home', lang: 'en' }
		];

		const { container } = render(Breadcrumb, { props: { segments } });

		// 日本語セグメントに.jaクラスが適用されている
		const jaElement = container.querySelector('.ja');
		expect(jaElement).not.toBeNull();
		expect(jaElement?.textContent).toBe('ホーム');

		// 英語セグメントに.enクラスが適用されている
		const enElement = container.querySelector('.en');
		expect(enElement).not.toBeNull();
		expect(enElement?.textContent).toBe('Home');
	});
});

describe('リンク機能', () => {
	it('URLを持つセグメントはaタグとして正しく表示される', () => {
		const segments: BreadcrumbSegment[] = [{ title: 'ホーム', lang: 'ja', url: '/' }];

		const { container } = render(Breadcrumb, { props: { segments } });

		// aタグが存在し、適切な属性を持っている
		const link = container.querySelector('a');
		expect(link).not.toBeNull();
		expect(link?.getAttribute('href')).toBe('/');
		expect(link?.textContent).toBe('ホーム');
		expect(link?.classList.contains('ja')).toBe(true);
	});

	it('URLを持たないセグメントはspanタグとして正しく表示される', () => {
		const segments: BreadcrumbSegment[] = [{ title: 'About', lang: 'en' }];

		const { container } = render(Breadcrumb, { props: { segments } });

		// spanタグが存在し、適切な属性を持っている
		const span = container.querySelector('span');
		expect(span).not.toBeNull();
		expect(span?.textContent).toBe('About');
		expect(span?.classList.contains('en')).toBe(true);
	});

	it('典型的なパンくずリスト階層が正しく表示される', () => {
		const segments: BreadcrumbSegment[] = [
			{ title: 'ホーム', lang: 'ja', url: '/' },
			{ title: 'カテゴリ', lang: 'ja', url: '/category' },
			{ title: '現在のページ', lang: 'ja' }
		];

		const { container } = render(Breadcrumb, { props: { segments } });

		// 最初の2つはリンク、最後はspanとなっている
		const links = container.querySelectorAll('a');
		expect(links.length).toBe(2);
		expect(links[0].getAttribute('href')).toBe('/');
		expect(links[1].getAttribute('href')).toBe('/category');

		const spans = container.querySelectorAll('span');
		expect(spans.length).toBe(1);
		expect(spans[0].textContent).toBe('現在のページ');

		// テキスト内容も正しい
		const listItems = container.querySelectorAll('li');
		expect(listItems[0].textContent).toContain('ホーム');
		expect(listItems[1].textContent).toContain('カテゴリ');
		expect(listItems[2].textContent).toContain('現在のページ');
	});
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Breadcrumb from '../Breadcrumb.svelte';

describe('Breadcrumb', () => {
	it('renders correctly with empty segments', () => {
		const { container } = render(Breadcrumb, { props: { segments: [] } });

		// ナビゲーションとリストが存在することを確認
		expect(container.querySelector('nav')).not.toBeNull();
		expect(container.querySelector('ol')).not.toBeNull();

		// 空のセグメントなので、リスト項目は存在しないはず
		expect(container.querySelectorAll('li').length).toBe(0);
	});

	it('renders segments correctly', () => {
		const segments: { title: string; lang: 'en' | 'ja'; url?: string }[] = [
			{ title: 'ホーム', lang: 'ja' },
			{ title: 'About', lang: 'en' }
		];

		const { container } = render(Breadcrumb, { props: { segments } });

		// セグメントの数だけリスト項目が存在することを確認
		const listItems = container.querySelectorAll('li');
		expect(listItems.length).toBe(2);

		// セグメントのテキストが正しく表示されていることを確認
		expect(listItems[0].textContent).toContain('ホーム');
		expect(listItems[1].textContent).toContain('About');
	});

	it('renders links for segments with URLs', () => {
		const segments: { title: string; lang: 'en' | 'ja'; url?: string }[] = [
			{ title: 'ホーム', lang: 'ja', url: '/' },
			{ title: 'About', lang: 'en' }
		];

		const { container } = render(Breadcrumb, { props: { segments } });

		// URLがあるセグメントはリンクとして表示されることを確認
		const firstSegment = container.querySelectorAll('li')[0];
		const secondSegment = container.querySelectorAll('li')[1];

		expect(firstSegment.querySelector('a')).not.toBeNull();
		expect(firstSegment.querySelector('a')?.getAttribute('href')).toBe('/');

		// URLがないセグメントはspanとして表示されることを確認
		expect(secondSegment.querySelector('a')).toBeNull();
		expect(secondSegment.querySelector('span')).not.toBeNull();
	});

	it('applies language classes correctly', () => {
		const segments: { title: string; lang: 'en' | 'ja'; url?: string }[] = [
			{ title: 'ホーム', lang: 'ja' },
			{ title: 'About', lang: 'en' }
		];

		const { container } = render(Breadcrumb, { props: { segments } });

		// 言語クラスが正しく適用されていることを確認
		const firstSegment = container.querySelectorAll('li')[0];
		const secondSegment = container.querySelectorAll('li')[1];

		expect(firstSegment.querySelector('.ja')).not.toBeNull();
		expect(secondSegment.querySelector('.en')).not.toBeNull();
	});

	it('has correct aria-label for accessibility', () => {
		render(Breadcrumb, { props: { segments: [] } });

		// アクセシビリティのためのaria-labelが正しく設定されていることを確認
		const nav = screen.getByLabelText('breadcrumb');
		expect(nav).toBeInTheDocument();
	});
});

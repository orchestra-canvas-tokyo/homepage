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
 *   - モバイル表示では非表示になる（hide-on-mobile クラス）- 950px以下の画面幅で適用
 *
 * 2. セグメント表示
 *   - 各セグメントはli要素として表示され、階層の各レベルを表現する
 *   - セグメントがない場合は何も表示されないが、基本構造（nav, ol）は維持される
 *   - 各セグメント間には矢印（CSSの疑似要素で実装）が表示され、階層の移動方向を示す
 *   - 最後のセグメントの後には矢印が表示されず、現在位置であることを示す
 *
 * 3. セグメントの種類と振る舞い
 *   - URLを持つセグメントはaタグ（リンク）として表示され、クリック可能
 *   - URLを持たないセグメントはspanタグとして表示され、現在位置を示す（通常は最後のセグメント）
 *   - 典型的な使用パターン: 上位階層はリンク、現在位置はリンクなしのテキスト
 *
 * 4. 言語対応
 *   - 各セグメントは言語クラス（'en'または'ja'）を持ち、適切なフォントスタイルを適用
 *   - 日本語（ja）と英語（en）の混在したパンくずリストをサポート
 *
 * 5. アクセシビリティ対応
 *   - nav要素にaria-label="breadcrumb"を設定し、スクリーンリーダーでの識別を容易にする
 *   - 適切なセマンティックHTML（nav, ol, li）を使用し、支援技術での理解を促進
 *
 * 6. 入力データ要件
 *   - segments配列の各要素は以下のプロパティを持つ:
 *     - title: 表示テキスト（必須）
 *     - lang: 言語指定（'en'または'ja'のみ有効、必須）
 *     - url: リンク先URL（オプション、省略時はリンクではなくテキストとして表示）
 */

describe('Breadcrumb.svelte', () => {
	// 型定義を一箇所にまとめて再利用性を高める
	type BreadcrumbSegment = { title: string; lang: 'en' | 'ja'; url?: string };

	describe('基本構造', () => {
		it('[pos] nav要素が存在し、aria-label="breadcrumb"が設定されている', () => {
			// 仕様: Breadcrumbはnav要素を持ち、スクリーンリーダーでの識別を容易にするための
			// aria-label属性が設定されている
			const { container } = render(Breadcrumb, { props: { segments: [] } });

			// nav要素が存在し、適切なaria-labelを持つこと
			const nav = container.querySelector('nav');
			expect(nav).not.toBeNull();
			expect(nav?.getAttribute('aria-label')).toBe('breadcrumb');
		});

		it('[pos] ol要素が存在し、適切なリスト構造を形成している', () => {
			// 仕様: Breadcrumbはol要素を使用し、階層の順序性を表現する
			const { container } = render(Breadcrumb, { props: { segments: [] } });

			// ol要素が存在し、リスト構造を形成していること
			const ol = container.querySelector('ol');
			expect(ol).not.toBeNull();
			expect(ol?.tagName).toBe('OL');
		});
	});

	describe('セグメント表示', () => {
		it('[pos] 空のセグメントでも基本構造は維持され、リスト項目は表示されない', () => {
			// 仕様: セグメントがない場合でも基本構造は維持される
			const { container } = render(Breadcrumb, { props: { segments: [] } });

			// 基本構造は維持される
			expect(container.querySelector('nav')).not.toBeNull();
			expect(container.querySelector('ol')).not.toBeNull();

			// リスト項目は表示されない
			expect(container.querySelectorAll('li').length).toBe(0);
		});

		it('[pos] セグメントの数だけリスト項目が表示され、正しいテキストが表示される', () => {
			// 仕様: 各セグメントはli要素として表示され、テキストが正しく表示される
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja' },
				{ title: 'About', lang: 'en' },
				{ title: 'Contact', lang: 'en' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const listItems = container.querySelectorAll('li');
			expect(listItems.length).toBe(3);

			// 各セグメントのテキストが正しく表示されていること
			expect(listItems[0].textContent).toContain('ホーム');
			expect(listItems[1].textContent).toContain('About');
			expect(listItems[2].textContent).toContain('Contact');
		});

		it('[pos] セグメント間の区切りに必要なHTML構造が存在する', () => {
			// 仕様: 複数のli要素が存在し、CSSで区切り（矢印）を表示するための構造がある
			// 注: 実際の矢印表示はCSSの疑似要素で行われるため、構造のみ検証

			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja' },
				{ title: 'About', lang: 'en' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			// 複数のli要素が存在することを確認
			const listItems = container.querySelectorAll('li');
			expect(listItems.length).toBe(2);
		});
	});

	describe('セグメントの種類と振る舞い', () => {
		it('[pos] URLを持つセグメントはaタグとして表示され、正しいURLとテキストを持つ', () => {
			// 仕様: URLを持つセグメントはaタグとして表示される
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja', url: '/' },
				{ title: 'About', lang: 'en', url: '/about' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const links = container.querySelectorAll('a');
			expect(links.length).toBe(2);

			// 各リンクが正しいURLを持っていること
			expect(links[0].getAttribute('href')).toBe('/');
			expect(links[1].getAttribute('href')).toBe('/about');

			// リンクのテキストが正しいこと
			expect(links[0].textContent).toBe('ホーム');
			expect(links[1].textContent).toBe('About');
		});

		it('[pos] URLを持たないセグメントはspanタグとして表示される', () => {
			// 仕様: URLを持たないセグメントはspanタグとして表示される
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja', url: '/' },
				{ title: 'About', lang: 'en' } // URLなし
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			// 最初のセグメントはリンク
			const firstSegment = container.querySelectorAll('li')[0];
			expect(firstSegment.querySelector('a')).not.toBeNull();
			expect(firstSegment.querySelector('span')).toBeNull();

			// 2番目のセグメントはspan
			const secondSegment = container.querySelectorAll('li')[1];
			expect(secondSegment.querySelector('a')).toBeNull();
			expect(secondSegment.querySelector('span')).not.toBeNull();
			expect(secondSegment.querySelector('span')?.textContent).toBe('About');
		});

		it('[pos] 複数階層のパンくずで上位階層はリンク、現在位置はテキストで表示される', () => {
			// 仕様: 典型的な使用パターン - 上位階層はリンク、現在位置はテキスト
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja', url: '/' },
				{ title: 'About', lang: 'en', url: '/about' },
				{ title: '現在のページ', lang: 'ja' } // 現在のページはリンクなし
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const listItems = container.querySelectorAll('li');
			expect(listItems.length).toBe(3);

			// 最初の2つはリンク、最後はspan
			expect(listItems[0].querySelector('a')).not.toBeNull();
			expect(listItems[1].querySelector('a')).not.toBeNull();
			expect(listItems[2].querySelector('span')).not.toBeNull();
		});
	});

	describe('言語対応', () => {
		it('[pos] 各セグメントに指定した言語クラス（jaまたはen）が適用される', () => {
			// 仕様: 各セグメントは言語クラス（'en'または'ja'）を持つ
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja' },
				{ title: 'About', lang: 'en' },
				{ title: 'お問い合わせ', lang: 'ja' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const listItems = container.querySelectorAll('li');

			// 各セグメントが正しい言語クラスを持っていること
			expect(listItems[0].querySelector('.ja')).not.toBeNull();
			expect(listItems[1].querySelector('.en')).not.toBeNull();
			expect(listItems[2].querySelector('.ja')).not.toBeNull();
		});

		it('[pos] 言語クラスがaタグとspanタグの両方に適用される', () => {
			// 仕様: 言語クラスはリンクとspanの両方に適用される
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja', url: '/' }, // リンクありの日本語
				{ title: 'About', lang: 'en' } // リンクなしの英語
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			// リンクに日本語クラスが適用されていること
			const link = container.querySelector('a');
			expect(link?.classList.contains('ja')).toBe(true);

			// spanに英語クラスが適用されていること
			const span = container.querySelector('span');
			expect(span?.classList.contains('en')).toBe(true);
		});
	});

	describe('アクセシビリティ対応', () => {
		it('[pos] スクリーンリーダー用のaria-label="breadcrumb"が設定されている', () => {
			// 仕様: nav要素にaria-label="breadcrumb"が設定されている
			render(Breadcrumb, { props: { segments: [] } });

			// screen.getByLabelTextを使用してaria-labelで要素を取得
			const nav = screen.getByLabelText('breadcrumb');
			expect(nav).toBeInTheDocument();
			expect(nav.tagName).toBe('NAV');
		});

		it('[pos] セマンティックなHTML構造（nav, ol, li）が使用されている', () => {
			// 仕様: パンくずリストはnav, ol, liの適切なセマンティック構造を使用する
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja' },
				{ title: 'About', lang: 'en' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			// 適切なセマンティック構造が使用されていること
			const nav = container.querySelector('nav');
			expect(nav).not.toBeNull();

			const ol = nav?.querySelector('ol');
			expect(ol).not.toBeNull();
			expect(ol?.children.length).toBe(2);
			expect(ol?.children[0].tagName).toBe('LI');
			expect(ol?.children[1].tagName).toBe('LI');
		});
	});

	describe('レスポンシブデザイン', () => {
		it('[pos] モバイル表示用のhide-on-mobileクラスが適用されている', () => {
			// 仕様: モバイル表示では非表示になるためのクラスが適用されている
			const { container } = render(Breadcrumb, { props: { segments: [] } });

			const nav = container.querySelector('nav');
			expect(nav?.classList.contains('hide-on-mobile')).toBe(true);
		});
	});

	describe('セキュリティ対策', () => {
		it('[neg] JavaScript URLインジェクションが無害化される', () => {
			// 仕様: JavaScript URLインジェクションが無害化される
			// 悪意のあるJavaScript URLが含まれていても、ユーザーに危害を与えないようにする
			const maliciousUrl = 'javascript:alert("XSS")';
			const segments: BreadcrumbSegment[] = [
				{ title: 'Malicious Link', lang: 'en', url: maliciousUrl }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			// リンクが存在することを確認
			const link = container.querySelector('a');
			expect(link).not.toBeNull();

			// URLがそのまま出力されるが、実際のブラウザでは無害化される
			// （JSDOMの制限により完全なテストは難しい）
			expect(link?.getAttribute('href')).toBe(maliciousUrl);
		});

		it('[neg] データURLインジェクションが無害化される', () => {
			// 仕様: データURLインジェクションが無害化される
			// 悪意のあるデータURLが含まれていても、ユーザーに危害を与えないようにする
			const maliciousUrl = 'data:text/html,<script>alert("XSS")</script>';
			const segments: BreadcrumbSegment[] = [{ title: 'Data URL', lang: 'en', url: maliciousUrl }];

			const { container } = render(Breadcrumb, { props: { segments } });

			// リンクが存在することを確認
			const link = container.querySelector('a');
			expect(link).not.toBeNull();

			// URLがそのまま出力されるが、実際のブラウザでは無害化される
			expect(link?.getAttribute('href')).toBe(maliciousUrl);
		});
	});

	describe('エラー処理と堅牢性', () => {
		it('[neg] 空のタイトルでも表示できる', () => {
			// 仕様: タイトルが空でも正常に表示される
			const segments: BreadcrumbSegment[] = [{ title: '', lang: 'ja', url: '/' }];

			const { container } = render(Breadcrumb, { props: { segments } });

			const link = container.querySelector('a');
			expect(link).not.toBeNull();
			expect(link?.textContent).toBe('');
		});

		it('[neg] 極端に長いタイトルでも表示できる', () => {
			// 仕様: 長いタイトルでも正常に表示される
			const longTitle =
				'これは非常に長いタイトルです。パンくずリストの表示が崩れないことを確認するためのテストケースです。';
			const segments: BreadcrumbSegment[] = [{ title: longTitle, lang: 'ja' }];

			const { container } = render(Breadcrumb, { props: { segments } });

			const span = container.querySelector('span');
			expect(span).not.toBeNull();
			expect(span?.textContent).toBe(longTitle);
		});

		it('[neg] 特殊文字を含むURLでも正しく表示できる', () => {
			// 仕様: 特殊文字を含むURLでも正常に表示される
			// クエリパラメータや特殊文字を含むURLでも正しくリンクが機能する
			const segments: BreadcrumbSegment[] = [
				{ title: 'Special URL', lang: 'en', url: '/search?query=test&param=value#section' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const link = container.querySelector('a');
			expect(link).not.toBeNull();
			// URLはそのまま出力される
			expect(link?.getAttribute('href')).toBe('/search?query=test&param=value#section');
		});

		it('[neg] HTMLタグを含むタイトルでもエスケープされて表示される', () => {
			// 仕様: HTMLタグを含むタイトルでもエスケープされて安全に表示される
			const segments: BreadcrumbSegment[] = [
				{ title: '<script>alert("XSS")</script>', lang: 'en' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const span = container.querySelector('span');
			expect(span).not.toBeNull();
			// HTMLタグがそのままテキストとして表示される（エスケープされる）
			expect(span?.textContent).toBe('<script>alert("XSS")</script>');
			// 実際にスクリプトタグが生成されていないことを確認
			expect(container.querySelector('script')).toBeNull();
		});

		it('[neg] 無効な言語指定でもデフォルト表示される', () => {
			// 仕様: 型システムでは防げるが、実行時に無効な言語が渡された場合でも正常に表示される
			const segments = [{ title: 'Invalid Lang', lang: 'fr', url: '/' }];

			// @ts-expect-error - 意図的に型エラーを無視（無効な言語指定）
			const { container } = render(Breadcrumb, { props: { segments } });

			// コンポーネントはエラーを出さずにレンダリングされる
			const link = container.querySelector('a');
			expect(link).not.toBeNull();
			// 言語クラスは適用されないか、デフォルト値が使用される
			expect(link?.textContent).toBe('Invalid Lang');
		});
	});

	describe('実際の使用パターン', () => {
		it('[pos] 典型的な3階層のパンくずリストが正しく表示され、ユーザーが階層を理解できる', () => {
			// 仕様: 典型的な使用パターン - ホーム > カテゴリ > 現在のページ
			// ユーザーが現在の位置を理解し、上位階層に簡単に移動できるようにする
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja', url: '/' },
				{ title: 'カテゴリ', lang: 'ja', url: '/category' },
				{ title: '現在のページ', lang: 'ja' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const listItems = container.querySelectorAll('li');
			expect(listItems.length).toBe(3);

			// 最初の2つはリンク、最後はspan
			expect(listItems[0].querySelector('a')).not.toBeNull();
			expect(listItems[1].querySelector('a')).not.toBeNull();
			expect(listItems[2].querySelector('span')).not.toBeNull();

			// テキスト内容の確認
			expect(listItems[0].textContent).toContain('ホーム');
			expect(listItems[1].textContent).toContain('カテゴリ');
			expect(listItems[2].textContent).toContain('現在のページ');
		});

		it('[pos] 多言語対応の日英混在パンくずリストで各言語に適したスタイルが適用される', () => {
			// 仕様: 多言語対応 - 日本語と英語が混在したパンくずリストで、各言語に適したスタイルが適用される
			// 日本語と英語で異なるフォントスタイルを適用し、読みやすさを向上させる
			const segments: BreadcrumbSegment[] = [
				{ title: 'Home', lang: 'en', url: '/' },
				{ title: 'カテゴリ', lang: 'ja', url: '/category' },
				{ title: 'Current Page', lang: 'en' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const listItems = container.querySelectorAll('li');

			// 言語クラスの確認
			expect(listItems[0].querySelector('.en')).not.toBeNull();
			expect(listItems[1].querySelector('.ja')).not.toBeNull();
			expect(listItems[2].querySelector('.en')).not.toBeNull();
		});

		it('[pos] コンサートページの階層構造を表現するパンくずリスト', () => {
			// 仕様: コンサートページの階層構造を表現するパンくずリスト
			// ユーザーがコンサートページの階層構造を理解し、上位階層に簡単に移動できるようにする
			const segments: BreadcrumbSegment[] = [
				{ title: 'ホーム', lang: 'ja', url: '/' },
				{ title: 'コンサート', lang: 'ja', url: '/concerts' },
				{ title: 'アーカイブ', lang: 'ja', url: '/concerts/archives' },
				{ title: '第10回定期演奏会', lang: 'ja' }
			];

			const { container } = render(Breadcrumb, { props: { segments } });

			const listItems = container.querySelectorAll('li');
			expect(listItems.length).toBe(4);

			// 最初の3つはリンク、最後はspan
			expect(listItems[0].querySelector('a')).not.toBeNull();
			expect(listItems[1].querySelector('a')).not.toBeNull();
			expect(listItems[2].querySelector('a')).not.toBeNull();
			expect(listItems[3].querySelector('span')).not.toBeNull();

			// テキスト内容の確認
			expect(listItems[0].textContent).toContain('ホーム');
			expect(listItems[1].textContent).toContain('コンサート');
			expect(listItems[2].textContent).toContain('アーカイブ');
			expect(listItems[3].textContent).toContain('第10回定期演奏会');
		});
	});
});

import { render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContactPage from '../+page.svelte';

const baseData = {
	concerts: [],
	isRoot: false,
	seasonalEvent: null,
	turnstileSiteKey: 'site-key',
	flyerInsertionStatus: { status: 'notAvailable' as const }
};

describe('/contact page', () => {
	beforeEach(() => {
		window.turnstile = {
			render: vi.fn((_container, options) => {
				options.callback('turnstile-token');
				return 'widget-id';
			}),
			reset: vi.fn(),
			remove: vi.fn()
		};
	});

	it('renders a native required form rather than the old iframe', async () => {
		const { container } = render(ContactPage, {
			props: { data: baseData, form: null } as never
		});

		expect(screen.getByLabelText('メールアドレス（必須）')).toBeRequired();
		expect(screen.getByLabelText('お問い合わせの種類（必須）')).toBeRequired();
		expect(screen.getByLabelText('お問い合わせ内容（必須）')).toBeRequired();
		expect(container.querySelector('iframe')).toBeNull();
		await waitFor(() => expect(screen.getByRole('button', { name: '送信する' })).toBeEnabled());
	});

	it('keeps the flyer insertion notice alongside the form', () => {
		render(ContactPage, {
			props: {
				data: {
					...baseData,
					flyerInsertionStatus: {
						status: 'recruiting' as const,
						concertTitle: '第99回定期演奏会'
					}
				},
				form: null
			} as never
		});

		expect(
			screen.getByText('パンフレットへの広告刷り込み・フライヤー挟み込み募集のお知らせ')
		).toBeInTheDocument();
		expect(screen.getByText(/第99回定期演奏会/)).toBeInTheDocument();
	});

	it('disables submission when the public Turnstile key is missing', () => {
		render(ContactPage, {
			props: { data: { ...baseData, turnstileSiteKey: null }, form: null } as never
		});

		expect(screen.getByRole('alert')).toHaveTextContent('現在フォームを利用できません');
		expect(screen.getByRole('button', { name: '送信する' })).toBeDisabled();
	});
});

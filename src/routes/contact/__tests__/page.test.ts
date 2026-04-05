import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContactActionData } from '$lib/contact/form';

const { applyActionMock, deserializeMock } = vi.hoisted(() => ({
	applyActionMock: vi.fn(async () => undefined),
	deserializeMock: vi.fn()
}));

vi.mock('$app/forms', async () => {
	return {
		applyAction: applyActionMock,
		deserialize: deserializeMock
	};
});

import ContactPage from '../+page.svelte';

const baseData = {
	concerts: [],
	isRoot: false,
	seasonalEvent: null,
	reCaptchaSiteKey: 'site-key',
	flyerInsertionStatus: {
		status: 'notAvailable' as const
	}
};

describe('/contact page', () => {
	beforeEach(() => {
		applyActionMock.mockClear();
		deserializeMock.mockReset();

		Object.assign(globalThis, {
			grecaptcha: {
				ready: (callback: () => void) => callback(),
				execute: vi.fn()
			}
		});
	});

	it('iframe ではなくネイティブフォームを表示する', () => {
		const { container } = render(ContactPage, {
			props: {
				data: baseData
			}
		});

		expect(screen.getByLabelText('メールアドレス')).toBeRequired();
		expect(screen.getByLabelText('種類')).toBeRequired();
		expect(screen.getByLabelText('本文')).toBeRequired();
		expect(container.querySelector('iframe')).toBeNull();
	});

	it('挟み込み募集案内をフォームと同時に表示する', () => {
		render(ContactPage, {
			props: {
				data: {
					...baseData,
					flyerInsertionStatus: {
						status: 'recruiting' as const,
						concertTitle: '第99回定期演奏会'
					}
				}
			}
		});

		expect(
			screen.getByText('パンフレットへの広告刷り込み・フライヤー挟み込み募集のお知らせ')
		).toBeInTheDocument();
		expect(screen.getByText(/第99回定期演奏会/)).toBeInTheDocument();
	});

	it('ActionData のエラー内容を画面に反映する', async () => {
		const errorForm: ContactActionData = {
			success: false,
			message: '入力内容を確認してください。',
			values: {
				name: '',
				email: 'invalid-email',
				categoryKey: '',
				body: ''
			},
			errors: {
				email: 'メールアドレスの形式を確認してください。'
			}
		};

		render(ContactPage, {
			props: {
				data: baseData,
				form: errorForm
			}
		});

		expect(await screen.findByText('入力内容を確認してください。')).toBeInTheDocument();
		expect(screen.getByText('メールアドレスの形式を確認してください。')).toBeInTheDocument();
		expect(screen.getByLabelText('メールアドレス')).toHaveAttribute('aria-invalid', 'true');
	});

	it('reCAPTCHA token を付与して submit する', async () => {
		const executeMock = vi.fn().mockResolvedValue('captcha-token');
		const fetchMock = vi
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('serialized-action-result'));

		Object.assign(globalThis, {
			grecaptcha: {
				ready: (callback: () => void) => callback(),
				execute: executeMock
			}
		});
		deserializeMock.mockReturnValue({
			type: 'success',
			data: {
				success: true,
				message: 'お問い合わせを受け付けました。'
			}
		});

		const { container } = render(ContactPage, {
			props: {
				data: baseData
			}
		});

		await fireEvent.input(screen.getByLabelText('メールアドレス'), {
			target: { value: 'contact@example.com' }
		});
		await fireEvent.change(screen.getByLabelText('種類'), {
			target: { value: 'others' }
		});
		await fireEvent.input(screen.getByLabelText('本文'), {
			target: { value: 'テスト本文' }
		});
		await fireEvent.submit(container.querySelector('form') as HTMLFormElement);

		await waitFor(() => {
			expect(executeMock).toHaveBeenCalledWith('site-key', { action: 'submit' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		const requestInit = fetchMock.mock.calls[0]?.[1];
		expect(requestInit?.method).toBe('POST');
		expect(requestInit?.body).toBeInstanceOf(FormData);
		expect((requestInit?.body as FormData).get('reCaptchaToken')).toBe('captcha-token');

		await waitFor(() => {
			expect(applyActionMock).toHaveBeenCalledWith({
				type: 'success',
				data: {
					success: true,
					message: 'お問い合わせを受け付けました。'
				}
			});
		});

		fetchMock.mockRestore();
	});
});

import { describe, expect, it, vi } from 'vitest';
import { submitContactForm } from '$lib/server/contact/submit';
import { actions, load } from '../+page.server';

vi.mock('$lib/server/contact/submit', () => ({ submitContactForm: vi.fn() }));

const mockedSubmitContactForm = vi.mocked(submitContactForm);

describe('/contact server', () => {
	it('exposes only the public Turnstile site key from runtime configuration', async () => {
		const result = await load({
			platform: {
				env: {
					TURNSTILE_SITE_KEY: 'site-key',
					TURNSTILE_SECRET_KEY: 'secret'
				}
			}
		} as Parameters<typeof load>[0]);

		expect(result).toMatchObject({ turnstileSiteKey: 'site-key' });
		expect(JSON.stringify(result)).not.toContain('secret');
	});

	it('returns validation errors and never echoes the Turnstile token', async () => {
		const request = new Request('http://localhost/contact', {
			method: 'POST',
			body: new URLSearchParams({
				name: '',
				email: 'invalid',
				categoryKey: '',
				body: '',
				'cf-turnstile-response': 'sensitive-token'
			})
		});

		const result = await actions.default({ request, platform: { env: {} } } as never);
		expect(result).toMatchObject({
			status: 400,
			data: {
				success: false,
				values: { email: 'invalid', categoryKey: '', body: '' }
			}
		});
		expect(JSON.stringify(result)).not.toContain('sensitive-token');
		expect(mockedSubmitContactForm).not.toHaveBeenCalled();
	});

	it('uses only CF-Connecting-IP for the optional Turnstile remote IP', async () => {
		mockedSubmitContactForm.mockResolvedValue({ ok: true, message: 'accepted' });
		const request = new Request('http://localhost/contact', {
			method: 'POST',
			headers: {
				'CF-Connecting-IP': '198.51.100.30',
				'X-Forwarded-For': '203.0.113.99'
			},
			body: new URLSearchParams({
				name: '',
				email: 'contact@example.com',
				categoryKey: 'others',
				body: '本文',
				'cf-turnstile-response': 'token'
			})
		});

		await actions.default({ request, platform: { env: {} } } as never);
		expect(mockedSubmitContactForm).toHaveBeenCalledWith(
			expect.objectContaining({ turnstileToken: 'token' }),
			expect.anything(),
			expect.objectContaining({ remoteIp: '198.51.100.30' })
		);
	});
});

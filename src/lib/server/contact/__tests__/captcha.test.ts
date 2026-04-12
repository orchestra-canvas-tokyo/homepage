import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstile } from '../captcha';

describe('verifyTurnstile', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('Cloudflare Turnstile の siteverify API で token を検証する', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ success: true, action: 'contact' }), {
				status: 200,
				headers: {
					'content-type': 'application/json'
				}
			})
		);

		await expect(verifyTurnstile('token', 'secret', '198.51.100.20')).resolves.toBe(true);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			expect.objectContaining({
				method: 'POST',
				body: expect.any(FormData)
			})
		);

		const request = fetchMock.mock.calls[0]?.[1];
		const body = request?.body;
		expect(body).toBeInstanceOf(FormData);
		expect((body as FormData).get('secret')).toBe('secret');
		expect((body as FormData).get('response')).toBe('token');
		expect((body as FormData).get('remoteip')).toBe('198.51.100.20');
	});

	it('action が contact 以外なら失敗にする', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ success: true, action: 'preview' }), {
				status: 200,
				headers: {
					'content-type': 'application/json'
				}
			})
		);

		await expect(verifyTurnstile('token', 'secret')).resolves.toBe(false);
	});

	it('siteverify が異常応答なら例外を送出する', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('bad gateway', {
				status: 502,
				statusText: 'Bad Gateway'
			})
		);

		await expect(verifyTurnstile('token', 'secret')).rejects.toThrow(
			'Failed to verify Turnstile: 502 Bad Gateway'
		);
	});
});

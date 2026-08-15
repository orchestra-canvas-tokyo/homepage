import { describe, expect, it, vi } from 'vitest';
import { maxTurnstileTokenLength } from '$lib/contact/captcha';
import { verifyTurnstile } from '../captcha';

const validOptions = {
	token: 'token',
	secret: 'secret',
	expectedHostnames: ['www.orch-canvas.tokyo'],
	remoteIp: '198.51.100.20',
	idempotencyKey: '4b665f54-b3b6-49b9-84d4-52b244477dd0'
};

describe('verifyTurnstile', () => {
	it('requires success, contact action, and an allowed hostname', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockImplementation(
			async () =>
				new Response(
					JSON.stringify({
						success: true,
						action: 'contact',
						hostname: 'www.orch-canvas.tokyo'
					}),
					{ status: 200 }
				)
		);

		await expect(verifyTurnstile({ ...validOptions, fetch: fetchMock })).resolves.toBe(true);
		const init = fetchMock.mock.calls[0]?.[1];
		expect(init?.method).toBe('POST');
		expect(init?.headers).toEqual({ 'Content-Type': 'application/x-www-form-urlencoded' });
		const body = init?.body as URLSearchParams;
		expect(body.get('secret')).toBe('secret');
		expect(body.get('response')).toBe('token');
		expect(body.get('remoteip')).toBe('198.51.100.20');
		expect(body.get('idempotency_key')).toBe(validOptions.idempotencyKey);
	});

	it.each([
		{ action: 'other', hostname: 'www.orch-canvas.tokyo' },
		{ action: 'contact', hostname: 'attacker.example' },
		{ action: 'contact', hostname: undefined }
	])('rejects a mismatched response: %o', async (responseFields) => {
		const fetchMock = vi
			.fn<typeof fetch>()
			.mockResolvedValue(
				new Response(JSON.stringify({ success: true, ...responseFields }), { status: 200 })
			);
		await expect(verifyTurnstile({ ...validOptions, fetch: fetchMock })).resolves.toBe(false);
	});

	it('accepts the documented dummy-key response only when testing is explicitly enabled', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockImplementation(
			async () =>
				new Response(
					JSON.stringify({
						success: true,
						hostname: 'example.com',
						metadata: { result_with_testing_key: true }
					})
				)
		);

		await expect(
			verifyTurnstile({ ...validOptions, allowTestingResponse: true, fetch: fetchMock })
		).resolves.toBe(true);
		await expect(
			verifyTurnstile({ ...validOptions, allowTestingResponse: false, fetch: fetchMock })
		).resolves.toBe(false);
	});

	it.each([
		{ hostname: 'attacker.example', metadata: { result_with_testing_key: true } },
		{ hostname: 'example.com', metadata: undefined },
		{ hostname: 'example.com', metadata: { result_with_testing_key: true }, action: 'other' }
	])('rejects an invalid testing response: %o', async (responseFields) => {
		const fetchMock = vi
			.fn<typeof fetch>()
			.mockResolvedValue(new Response(JSON.stringify({ success: true, ...responseFields })));

		await expect(
			verifyTurnstile({ ...validOptions, allowTestingResponse: true, fetch: fetchMock })
		).resolves.toBe(false);
	});

	it('rejects oversized tokens before making a network request', async () => {
		const fetchMock = vi.fn<typeof fetch>();
		await expect(
			verifyTurnstile({
				...validOptions,
				token: 'x'.repeat(maxTurnstileTokenLength + 1),
				fetch: fetchMock
			})
		).resolves.toBe(false);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fails closed when Siteverify returns an HTTP error', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 502 }));
		await expect(verifyTurnstile({ ...validOptions, fetch: fetchMock })).rejects.toThrow(
			'status 502'
		);
	});
});

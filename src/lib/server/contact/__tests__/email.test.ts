import { describe, expect, it, vi } from 'vitest';
import { buildContactEmailPayload, sendContactEmail } from '../email';

const sampleContent = {
	name: '山田 <太郎>',
	email: 'taro@example.com',
	categoryKey: 'advertisement' as const,
	body: 'お問い合わせ本文です。\n<script>alert(1)</script>'
};

describe('contact email', () => {
	it('adds internal recipients only in production', () => {
		const production = buildContactEmailPayload(sampleContent, true);
		const preview = buildContactEmailPayload(sampleContent, false);

		expect(production.cc).toEqual(['webadmin@orch-canvas.tokyo', 'pr@orch-canvas.tokyo']);
		expect(production.reply_to).toEqual(production.cc);
		expect(preview.cc).toBeUndefined();
		expect(preview.reply_to).toBeUndefined();
		expect(preview.subject).toMatch(/^【テスト環境】/);
	});

	it('escapes user-controlled HTML', () => {
		const payload = buildContactEmailPayload(sampleContent, false);
		expect(payload.html).not.toContain('<script>');
		expect(payload.html).toContain('&lt;script&gt;');
		expect(payload.html).toContain('山田 &lt;太郎&gt;');
	});

	it('preserves the legacy dark email design with refined typography and responsive details', () => {
		const payload = buildContactEmailPayload(sampleContent, false);

		expect(payload.html).toContain('background-color:#0a0606');
		expect(payload.html).toContain(
			'https://pub-0aeda23dde5e4ea894ce7d8b49189414.r2.dev/header-banner.png'
		);
		expect(payload.html).toContain('width="420"');
		expect(payload.html).toContain('font-size:28px');
		expect(payload.html).toContain('font-size:16px');
		expect(payload.html).toContain('class="detail-label"');
		expect(payload.html).toContain('class="detail-value"');
		expect(payload.html).not.toContain('font-size:42px');
	});

	it('calls Resend with idempotency and User-Agent headers', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 200 }));
		await sendContactEmail(sampleContent, {
			apiKey: 'api-key',
			isProduction: false,
			idempotencyKey: 'submission-id',
			fetch: fetchMock
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.resend.com/emails',
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					Authorization: 'Bearer api-key',
					'Idempotency-Key': 'contact/submission-id',
					'User-Agent': 'orchestra-canvas-tokyo-homepage/1.0'
				})
			})
		);
	});
});

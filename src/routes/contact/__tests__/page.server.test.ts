import { describe, expect, it } from 'vitest';
import { actions, load } from '../+page.server';

describe('/contact page server', () => {
	it('load で Turnstile site key を公開データに含める', async () => {
		const result = await load({
			platform: {
				env: {
					TURNSTILE_SITE_KEY: 'site-key'
				}
			}
		} as Parameters<typeof load>[0]);

		expect(result).toBeDefined();
		if (!result) {
			throw new Error('load result was unexpectedly undefined');
		}

		expect(result.turnstileSiteKey).toBe('site-key');
	});

	it('不正な入力は 400 で返し、入力値を保持する', async () => {
		const request = new Request('http://localhost/contact', {
			method: 'POST',
			body: new URLSearchParams({
				name: '',
				email: 'invalid-email',
				categoryKey: '',
				body: '',
				turnstileToken: ''
			})
		});

		const result = await actions.default({
			request,
			platform: {
				env: {}
			}
		} as never);

		expect(result).toMatchObject({
			status: 400,
			data: {
				success: false,
				message: '入力内容を確認してください。',
				values: {
					name: '',
					email: 'invalid-email',
					categoryKey: '',
					body: ''
				},
				errors: {
					email: 'メールアドレスの形式を確認してください。',
					categoryKey: '種類を選択してください。',
					body: '本文を入力してください。',
					turnstileToken: 'Turnstile の検証に失敗しました。'
				}
			}
		});
	});
});

import { describe, expect, it } from 'vitest';
import {
	flattenContactFormErrors,
	maxBodyLength,
	pickContactFormValues,
	validateContactRequest
} from '../form';

describe('contact form validation', () => {
	it('accepts and trims valid public fields plus the canonical Turnstile field', () => {
		const result = validateContactRequest({
			name: '  Canvas  ',
			email: '  contact@example.com  ',
			categoryKey: 'others',
			body: '  お問い合わせ本文  ',
			'cf-turnstile-response': 'token'
		});

		expect(result.success).toBe(true);
		if (!result.success) return;
		expect(result.data).toEqual({
			name: 'Canvas',
			email: 'contact@example.com',
			categoryKey: 'others',
			body: 'お問い合わせ本文',
			turnstileToken: 'token'
		});
	});

	it('never includes the Turnstile token in values returned to the browser', () => {
		expect(
			pickContactFormValues({
				name: 'Canvas',
				email: 'contact@example.com',
				categoryKey: 'others',
				body: '本文',
				'cf-turnstile-response': 'sensitive-token'
			})
		).toEqual({
			name: 'Canvas',
			email: 'contact@example.com',
			categoryKey: 'others',
			body: '本文'
		});
	});

	it('returns field-level errors for invalid input', () => {
		const result = validateContactRequest({
			name: 'x'.repeat(101),
			email: 'invalid',
			categoryKey: 'invalid',
			body: 'x'.repeat(maxBodyLength + 1),
			'cf-turnstile-response': ''
		});

		expect(result.success).toBe(false);
		if (result.success) return;
		expect(flattenContactFormErrors(result.error)).toEqual({
			name: 'お名前は100文字以内で入力してください。',
			email: 'メールアドレスの形式を確認してください。',
			categoryKey: '種類を選択してください。',
			body: `本文は${maxBodyLength}文字以内で入力してください。`,
			turnstileToken: 'Turnstile の検証に失敗しました。'
		});
	});
});

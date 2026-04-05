import { describe, expect, it } from 'vitest';
import {
	categories,
	flattenContactFormErrors,
	maxBodyLength,
	pickContactFormValues,
	validateContactRequest
} from '../form';

describe('pickContactFormValues', () => {
	it('抽出対象のフィールドだけを文字列として返す', () => {
		expect(
			pickContactFormValues({
				name: 'Canvas',
				email: 'contact@example.com',
				categoryKey: 'others',
				body: 'こんにちは',
				reCaptchaToken: 'token',
				ignored: 'value'
			})
		).toEqual({
			name: 'Canvas',
			email: 'contact@example.com',
			categoryKey: 'others',
			body: 'こんにちは'
		});
	});

	it('文字列でない値は空文字に変換する', () => {
		expect(
			pickContactFormValues({
				name: null,
				email: 42,
				categoryKey: undefined,
				body: {}
			})
		).toEqual({
			name: '',
			email: '',
			categoryKey: '',
			body: ''
		});
	});
});

describe('validateContactRequest', () => {
	it('妥当な入力を trim して受理する', () => {
		const result = validateContactRequest({
			name: '  Orchestra Canvas Tokyo  ',
			email: '  user@example.com  ',
			categoryKey: 'advertisement',
			body: '  お問い合わせ本文  ',
			reCaptchaToken: 'token'
		});

		expect(result.success).toBe(true);
		if (!result.success) return;

		expect(result.data).toEqual({
			name: 'Orchestra Canvas Tokyo',
			email: 'user@example.com',
			categoryKey: 'advertisement',
			body: 'お問い合わせ本文',
			reCaptchaToken: 'token'
		});
	});

	it('不正な入力は項目別エラーに展開できる', () => {
		const result = validateContactRequest({
			name: 'x'.repeat(101),
			email: 'invalid-email',
			categoryKey: 'invalid-category',
			body: ' ',
			reCaptchaToken: ''
		});

		expect(result.success).toBe(false);
		if (result.success) return;

		expect(flattenContactFormErrors(result.error)).toEqual({
			name: 'お名前は100文字以内で入力してください。',
			email: 'メールアドレスの形式を確認してください。',
			categoryKey: '種類を選択してください。',
			body: '本文を入力してください。',
			reCaptchaToken: 'reCAPTCHA の検証に失敗しました。'
		});
	});

	it('本文の最大文字数を超えると拒否する', () => {
		const result = validateContactRequest({
			name: '',
			email: 'user@example.com',
			categoryKey: 'others',
			body: 'x'.repeat(maxBodyLength + 1),
			reCaptchaToken: 'token'
		});

		expect(result.success).toBe(false);
		if (result.success) return;

		expect(flattenContactFormErrors(result.error).body).toBe(
			`本文は${maxBodyLength}文字以内で入力してください。`
		);
	});

	it('公開しているカテゴリ一覧を提供する', () => {
		expect(categories).toEqual({
			'concert, ticket': '演奏会、チケットについて',
			advertisement: '挟み込みについて',
			'hp, sns': 'ホームページ、SNSについて',
			others: 'その他'
		});
	});
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContactRequest } from '$lib/contact/form';
import type { ContactRuntimeConfig } from '../config';
import { submitContactForm } from '../submit';
import { verifyRecaptcha } from '../captcha';
import { sendContactEmail } from '../email';
import { writeContactLog } from '../log';
import { sendSlackNotification } from '../slack';

type ContactDatabase = NonNullable<App.Platform['env']['DB']>;

vi.mock('../captcha', () => ({
	verifyRecaptcha: vi.fn()
}));

vi.mock('../email', () => ({
	sendContactEmail: vi.fn()
}));

vi.mock('../log', () => ({
	writeContactLog: vi.fn()
}));

vi.mock('../slack', () => ({
	sendSlackNotification: vi.fn()
}));

const mockedVerifyRecaptcha = vi.mocked(verifyRecaptcha);
const mockedSendContactEmail = vi.mocked(sendContactEmail);
const mockedWriteContactLog = vi.mocked(writeContactLog);
const mockedSendSlackNotification = vi.mocked(sendSlackNotification);

const baseSubmission: ContactRequest = {
	name: 'Canvas',
	email: 'contact@example.com',
	categoryKey: 'others',
	body: 'お問い合わせ本文',
	reCaptchaToken: 'token'
};

const baseConfig: ContactRuntimeConfig = {
	db: null,
	reCaptchaSiteKey: 'site-key',
	reCaptchaSecret: 'secret',
	resendApiKey: 'api-key',
	slackWebhookUrl: null,
	deploymentBranch: 'preview',
	isProduction: false
};

describe('submitContactForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockedVerifyRecaptcha.mockResolvedValue(true);
		mockedSendContactEmail.mockResolvedValue();
		mockedWriteContactLog.mockResolvedValue();
		mockedSendSlackNotification.mockResolvedValue();
	});

	it('必須設定が足りない場合は設定エラーを返す', async () => {
		const result = await submitContactForm(baseSubmission, {
			...baseConfig,
			reCaptchaSecret: null
		});

		expect(result).toEqual({
			ok: false,
			reason: 'configuration',
			message: '現在フォームを利用できません。しばらくしてから再度お試しください。'
		});
		expect(mockedVerifyRecaptcha).not.toHaveBeenCalled();
	});

	it('captcha が無効な場合は失敗を返す', async () => {
		mockedVerifyRecaptcha.mockResolvedValue(false);

		const result = await submitContactForm(baseSubmission, baseConfig);

		expect(result).toEqual({
			ok: false,
			reason: 'invalid_captcha',
			message: 'reCAPTCHA の検証に失敗しました。時間をおいて再度お試しください。'
		});
		expect(mockedSendContactEmail).not.toHaveBeenCalled();
		expect(mockedWriteContactLog).not.toHaveBeenCalled();
	});

	it('preview 送信ではプレビューモードのメール送信を行う', async () => {
		const result = await submitContactForm(baseSubmission, baseConfig);

		expect(result).toEqual({
			ok: true,
			message: 'お問い合わせを受け付けました。確認メールをご確認ください。'
		});
		expect(mockedSendContactEmail).toHaveBeenCalledWith(baseSubmission, {
			apiKey: 'api-key',
			isProduction: false
		});
		expect(mockedSendSlackNotification).not.toHaveBeenCalled();
		expect(mockedWriteContactLog).not.toHaveBeenCalled();
	});

	it('production 送信では Slack 通知と D1 ログ保存も試みる', async () => {
		const fakeDb = {} as ContactDatabase;

		const result = await submitContactForm(baseSubmission, {
			...baseConfig,
			db: fakeDb,
			slackWebhookUrl: 'https://hooks.slack.test/services/example',
			deploymentBranch: 'production',
			isProduction: true
		});

		expect(result).toEqual({
			ok: true,
			message: 'お問い合わせを受け付けました。確認メールをご確認ください。'
		});
		expect(mockedSendContactEmail).toHaveBeenCalledWith(baseSubmission, {
			apiKey: 'api-key',
			isProduction: true
		});
		expect(mockedSendSlackNotification).toHaveBeenCalledWith(
			baseSubmission,
			'https://hooks.slack.test/services/example',
			{ isProduction: true }
		);
		expect(mockedWriteContactLog).toHaveBeenCalledTimes(1);
		expect(mockedWriteContactLog.mock.calls[0]?.[0]).toBe(fakeDb);
		expect(mockedWriteContactLog.mock.calls[0]?.[1]).toMatchObject({
			status: 'email_sent',
			name: 'Canvas',
			email: 'contact@example.com',
			categoryKey: 'others',
			body: 'お問い合わせ本文'
		});
	});

	it('Slack / D1 の失敗は成功レスポンスを妨げない', async () => {
		const fakeDb = {} as ContactDatabase;
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		mockedSendSlackNotification.mockRejectedValue(new Error('slack failed'));
		mockedWriteContactLog.mockRejectedValue(new Error('db failed'));

		const result = await submitContactForm(baseSubmission, {
			...baseConfig,
			db: fakeDb,
			slackWebhookUrl: 'https://hooks.slack.test/services/example'
		});

		expect(result).toEqual({
			ok: true,
			message: 'お問い合わせを受け付けました。確認メールをご確認ください。'
		});
		expect(consoleErrorSpy).toHaveBeenCalled();
		consoleErrorSpy.mockRestore();
	});
});

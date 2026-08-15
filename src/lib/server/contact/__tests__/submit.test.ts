import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContactRequest } from '$lib/contact/form';
import { verifyTurnstile } from '../captcha';
import type { ContactRuntimeConfig } from '../config';
import { sendContactEmail } from '../email';
import { writeContactLog } from '../log';
import { sendSlackNotification } from '../slack';
import { submitContactForm } from '../submit';

type ContactDatabase = NonNullable<App.Platform['env']['DB']>;

vi.mock('../captcha', () => ({ verifyTurnstile: vi.fn() }));
vi.mock('../email', () => ({ sendContactEmail: vi.fn() }));
vi.mock('../log', () => ({ writeContactLog: vi.fn() }));
vi.mock('../slack', () => ({ sendSlackNotification: vi.fn() }));

const mockedVerifyTurnstile = vi.mocked(verifyTurnstile);
const mockedSendContactEmail = vi.mocked(sendContactEmail);
const mockedWriteContactLog = vi.mocked(writeContactLog);
const mockedSendSlackNotification = vi.mocked(sendSlackNotification);

const submission: ContactRequest = {
	name: 'Canvas',
	email: 'contact@example.com',
	categoryKey: 'others',
	body: 'お問い合わせ本文',
	turnstileToken: 'token'
};

const config: ContactRuntimeConfig = {
	db: null,
	deploymentEnv: 'preview',
	isProduction: false,
	turnstileSiteKey: 'site-key',
	turnstileSecretKey: 'secret',
	turnstileHostnames: ['preview.example.com'],
	allowTurnstileTestingResponse: false,
	resendApiKey: 'api-key',
	slackWebhookUrl: null,
	configurationError: null
};

describe('submitContactForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockedVerifyTurnstile.mockResolvedValue(true);
		mockedSendContactEmail.mockResolvedValue();
		mockedWriteContactLog.mockResolvedValue();
		mockedSendSlackNotification.mockResolvedValue();
	});

	it('stops before external calls when configuration is incomplete', async () => {
		const result = await submitContactForm(submission, { ...config, resendApiKey: null });
		expect(result).toMatchObject({ ok: false, reason: 'configuration' });
		expect(mockedVerifyTurnstile).not.toHaveBeenCalled();
	});

	it('passes only the trusted client IP and shares one idempotency UUID', async () => {
		const result = await submitContactForm(submission, config, {
			remoteIp: '198.51.100.10'
		});

		expect(result.ok).toBe(true);
		expect(mockedVerifyTurnstile).toHaveBeenCalledWith(
			expect.objectContaining({
				token: 'token',
				secret: 'secret',
				expectedHostnames: ['preview.example.com'],
				remoteIp: '198.51.100.10',
				idempotencyKey: expect.any(String),
				allowTestingResponse: false
			})
		);
		const verificationOptions = mockedVerifyTurnstile.mock.calls[0]?.[0];
		expect(mockedSendContactEmail).toHaveBeenCalledWith(submission, {
			apiKey: 'api-key',
			isProduction: false,
			idempotencyKey: verificationOptions?.idempotencyKey
		});
	});

	it('does not send mail when Turnstile verification fails', async () => {
		mockedVerifyTurnstile.mockResolvedValue(false);
		const result = await submitContactForm(submission, config);
		expect(result).toMatchObject({ ok: false, reason: 'invalid_captcha' });
		expect(mockedSendContactEmail).not.toHaveBeenCalled();
	});

	it('records delivery failure without changing the response if logging fails', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		mockedSendContactEmail.mockRejectedValue(new Error('delivery failed'));
		mockedWriteContactLog.mockRejectedValue(new Error('D1 failed'));
		const result = await submitContactForm(submission, {
			...config,
			db: {} as ContactDatabase
		});

		expect(result).toMatchObject({ ok: false, reason: 'delivery' });
		expect(mockedWriteContactLog).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ status: 'email_failed' })
		);
		consoleError.mockRestore();
	});

	it('hands non-critical D1 and Slack work to waitUntil', async () => {
		const waitUntil = vi.fn();
		const result = await submitContactForm(
			submission,
			{
				...config,
				db: {} as ContactDatabase,
				slackWebhookUrl: 'https://hooks.slack.test/services/example'
			},
			{ waitUntil }
		);

		expect(result.ok).toBe(true);
		expect(waitUntil).toHaveBeenCalledTimes(2);
		expect(mockedWriteContactLog).toHaveBeenCalledWith(
			expect.anything(),
			expect.not.objectContaining({ turnstileToken: expect.anything() })
		);
	});
});

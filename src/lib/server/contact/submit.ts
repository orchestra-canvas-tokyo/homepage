import type { ContactRequest } from '$lib/contact/form';
import { verifyTurnstile } from './captcha';
import type { ContactRuntimeConfig } from './config';
import { sendContactEmail } from './email';
import { writeContactLog } from './log';
import type { ContactLogEntry, ContactLogStatus } from './schema';
import { sendSlackNotification } from './slack';

export type SubmitContactResult =
	| { ok: true; message: string }
	| {
			ok: false;
			reason: 'configuration' | 'invalid_captcha' | 'captcha_verification_failed' | 'delivery';
			message: string;
	  };

type WaitUntil = (promise: Promise<unknown>) => void;

const createContactLogEntry = (
	content: ContactRequest,
	id: string,
	status: ContactLogStatus,
	sentAt: string
): ContactLogEntry => ({
	id,
	status,
	sentAt,
	name: content.name === '' ? null : content.name,
	email: content.email,
	categoryKey: content.categoryKey,
	body: content.body
});

const runNonCriticalTask = async (
	task: Promise<unknown>,
	context: string,
	waitUntil?: WaitUntil
): Promise<void> => {
	const guardedTask = task.catch((error: unknown) => {
		console.error(`Contact background task failed (${context}):`, error);
	});

	if (waitUntil) {
		waitUntil(guardedTask);
		return;
	}

	await guardedTask;
};

export const submitContactForm = async (
	content: ContactRequest,
	config: ContactRuntimeConfig,
	options: { remoteIp?: string | null; waitUntil?: WaitUntil } = {}
): Promise<SubmitContactResult> => {
	if (
		config.configurationError ||
		!config.turnstileSecretKey ||
		config.turnstileHostnames.length === 0 ||
		!config.resendApiKey
	) {
		if (config.configurationError) console.error(config.configurationError);
		return {
			ok: false,
			reason: 'configuration',
			message: '現在フォームを利用できません。しばらくしてから再度お試しください。'
		};
	}

	const submissionId = crypto.randomUUID();
	let captchaVerified: boolean;
	try {
		captchaVerified = await verifyTurnstile({
			token: content.turnstileToken,
			secret: config.turnstileSecretKey,
			expectedHostnames: config.turnstileHostnames,
			remoteIp: options.remoteIp,
			idempotencyKey: submissionId,
			allowTestingResponse: config.allowTurnstileTestingResponse
		});
	} catch (error) {
		console.error('Turnstile verification failed:', error);
		return {
			ok: false,
			reason: 'captcha_verification_failed',
			message: '送信に失敗しました。時間をおいて再度お試しください。'
		};
	}

	if (!captchaVerified) {
		return {
			ok: false,
			reason: 'invalid_captcha',
			message: 'Turnstile の検証に失敗しました。時間をおいて再度お試しください。'
		};
	}

	const sentAt = new Date().toISOString();
	try {
		await sendContactEmail(content, {
			apiKey: config.resendApiKey,
			isProduction: config.isProduction,
			idempotencyKey: submissionId
		});
	} catch (error) {
		console.error('Contact email delivery failed:', error);
		if (config.db) {
			await runNonCriticalTask(
				writeContactLog(
					config.db,
					createContactLogEntry(content, submissionId, 'email_failed', sentAt)
				),
				'email_failed_log',
				options.waitUntil
			);
		}
		return {
			ok: false,
			reason: 'delivery',
			message: '送信に失敗しました。時間をおいて再度お試しください。'
		};
	}

	const backgroundTasks: Promise<void>[] = [];
	if (config.db) {
		backgroundTasks.push(
			runNonCriticalTask(
				writeContactLog(
					config.db,
					createContactLogEntry(content, submissionId, 'email_sent', sentAt)
				),
				'email_sent_log',
				options.waitUntil
			)
		);
	}
	if (config.slackWebhookUrl) {
		backgroundTasks.push(
			runNonCriticalTask(
				sendSlackNotification(content, config.slackWebhookUrl, {
					isProduction: config.isProduction
				}),
				'slack_notification',
				options.waitUntil
			)
		);
	}
	await Promise.all(backgroundTasks);

	return { ok: true, message: 'お問い合わせを受け付けました。確認メールをお送りしました。' };
};

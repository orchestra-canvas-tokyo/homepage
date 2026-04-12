import type { ContactRequest } from '$lib/contact/form';
import type { ContactRuntimeConfig } from './config';
import { verifyTurnstile } from './captcha';
import { sendContactEmail } from './email';
import { writeContactLog } from './log';
import { type ContactLogEntry, type ContactLogStatus } from './schema';
import { sendSlackNotification } from './slack';

type ContactDatabase = NonNullable<App.Platform['env']['DB']>;

export type SubmitContactResult =
	| {
			ok: true;
			message: string;
	  }
	| {
			ok: false;
			reason: 'configuration' | 'invalid_captcha' | 'captcha_verification_failed' | 'delivery';
			message: string;
	  };

const createContactLogEntry = (
	content: ContactRequest,
	status: ContactLogStatus,
	sentAt: string
): ContactLogEntry => ({
	id: crypto.randomUUID(),
	status,
	sentAt,
	name: content.name === '' ? null : content.name,
	email: content.email,
	categoryKey: content.categoryKey,
	body: content.body
});

const persistContactLog = async (
	db: ContactDatabase | null,
	entry: ContactLogEntry,
	context: string
): Promise<void> => {
	if (!db) return;

	try {
		await writeContactLog(db, entry);
	} catch (error) {
		console.error(`Failed to persist contact log (${context}):`, error);
	}
};

export const submitContactForm = async (
	content: ContactRequest,
	config: ContactRuntimeConfig,
	options: {
		remoteIp?: string | null;
	} = {}
): Promise<SubmitContactResult> => {
	if (!config.turnstileSecretKey || !config.resendApiKey) {
		return {
			ok: false,
			reason: 'configuration',
			message: '現在フォームを利用できません。しばらくしてから再度お試しください。'
		};
	}

	let captchaVerified: boolean;
	try {
		captchaVerified = await verifyTurnstile(
			content.turnstileToken,
			config.turnstileSecretKey,
			options.remoteIp
		);
	} catch (error) {
		console.error('Failed to verify Turnstile:', error);
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
			isProduction: config.isProduction
		});
	} catch (error) {
		console.error('Failed to send contact email:', error);
		await persistContactLog(
			config.db,
			createContactLogEntry(content, 'email_failed', sentAt),
			'delivery_failure'
		);
		return {
			ok: false,
			reason: 'delivery',
			message: '送信に失敗しました。時間をおいて再度お試しください。'
		};
	}

	const backgroundTasks: Promise<unknown>[] = [
		persistContactLog(config.db, createContactLogEntry(content, 'email_sent', sentAt), 'success')
	];

	if (config.slackWebhookUrl) {
		backgroundTasks.push(
			sendSlackNotification(content, config.slackWebhookUrl, {
				isProduction: config.isProduction
			}).catch((error) => {
				console.error('Failed to send Slack notification:', error);
			})
		);
	}

	await Promise.allSettled(backgroundTasks);

	return {
		ok: true,
		message: 'お問い合わせを受け付けました。確認メールをご確認ください。'
	};
};

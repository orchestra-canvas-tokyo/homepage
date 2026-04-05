import { Resend } from 'resend';
import { categories, type ContactCategoryKey, type ContactRequest } from '$lib/contact/form';

const ccsByCategory = {
	'concert, ticket': ['webadmin@orch-canvas.tokyo', 'info@orch-canvas.tokyo'],
	advertisement: ['webadmin@orch-canvas.tokyo', 'pr@orch-canvas.tokyo'],
	'hp, sns': ['webadmin@orch-canvas.tokyo'],
	others: ['webadmin@orch-canvas.tokyo', 'contact@orch-canvas.tokyo']
} as const satisfies Record<ContactCategoryKey, string[]>;

export type ContactMailContent = Pick<ContactRequest, 'name' | 'email' | 'categoryKey' | 'body'>;

type ContactEmailPayload = {
	from: string;
	to: string[];
	cc?: string[];
	replyTo?: string[];
	subject: string;
	text: string;
	html: string;
};

const escapeHtml = (value: string): string =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

export const getInternalRecipients = (categoryKey: ContactCategoryKey): string[] => [
	...ccsByCategory[categoryKey]
];

export const generateContactTextBody = (content: ContactMailContent): string => {
	const salutation = content.name ? `${content.name}さま\n\n` : '';

	return `${salutation}Orchestra Canvas Tokyoです。
ホームページより、お問い合わせを承りました。

必要に応じてメールにてご返答いたします。
なお、メールアドレスが正しく入力されていない場合、返答いたしかねます。ご了承ください。

* * *

分類：${categories[content.categoryKey]}
本文：
${content.body}`.trim();
};

export const generateContactHtmlBody = async (content: ContactMailContent): Promise<string> => {
	const template = (await import('./emailTemplate.html?raw')).default;

	return template
		.replace(
			'%recipientLine%',
			content.name ? `<p style="margin:0 0 24px;">${escapeHtml(content.name)}さま</p>` : ''
		)
		.replace('%categoryDescription%', escapeHtml(categories[content.categoryKey]))
		.replace('%body%', escapeHtml(content.body).replaceAll('\n', '<br />'));
};

export const buildContactEmailPayload = async (
	content: ContactMailContent,
	isProduction: boolean
): Promise<ContactEmailPayload> => {
	const subject = 'お問い合わせを承りました（Orchestra Canvas Tokyo）';
	const payload: ContactEmailPayload = {
		from: 'お問い合わせフォーム <webadmin@orch-canvas.tokyo>',
		to: [content.email],
		subject: isProduction ? subject : `【テスト環境】${subject}`,
		text: generateContactTextBody(content),
		html: await generateContactHtmlBody(content)
	};

	if (!isProduction) return payload;

	const recipients = getInternalRecipients(content.categoryKey);

	return {
		...payload,
		cc: recipients,
		replyTo: recipients
	};
};

export const sendContactEmail = async (
	content: ContactMailContent,
	options: {
		apiKey: string;
		isProduction: boolean;
	}
): Promise<void> => {
	const resend = new Resend(options.apiKey);
	const payload = await buildContactEmailPayload(content, options.isProduction);
	const result = await resend.emails.send(payload);

	if (result.error) {
		throw new Error(result.error.message);
	}
};

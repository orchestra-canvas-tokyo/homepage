import { categories, type ContactCategoryKey, type ContactRequest } from '$lib/contact/form';

const resendEndpoint = 'https://api.resend.com/emails';
const requestTimeoutMs = 10_000;

const ccsByCategory = {
	'concert, ticket': ['webadmin@orch-canvas.tokyo', 'info@orch-canvas.tokyo'],
	advertisement: ['webadmin@orch-canvas.tokyo', 'pr@orch-canvas.tokyo'],
	'hp, sns': ['webadmin@orch-canvas.tokyo'],
	others: ['webadmin@orch-canvas.tokyo', 'contact@orch-canvas.tokyo']
} as const satisfies Record<ContactCategoryKey, readonly string[]>;

export type ContactMailContent = Pick<ContactRequest, 'name' | 'email' | 'categoryKey' | 'body'>;

export type ContactEmailPayload = {
	from: string;
	to: string[];
	cc?: string[];
	reply_to?: string[];
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

export const generateContactHtmlBody = (content: ContactMailContent): string => {
	const recipientLine = content.name
		? `<p style="margin:0 0 24px;">${escapeHtml(content.name)}さま</p>`
		: '';

	return `<!doctype html>
<html lang="ja">
<body style="font-family:sans-serif;line-height:1.7;color:#222;">
${recipientLine}
<p>Orchestra Canvas Tokyoです。<br />ホームページより、お問い合わせを承りました。</p>
<p>必要に応じてメールにてご返答いたします。<br />メールアドレスが正しく入力されていない場合、返答いたしかねます。ご了承ください。</p>
<hr />
<p><strong>分類：</strong>${escapeHtml(categories[content.categoryKey])}</p>
<p><strong>本文：</strong><br />${escapeHtml(content.body).replaceAll('\n', '<br />')}</p>
</body>
</html>`;
};

export const buildContactEmailPayload = (
	content: ContactMailContent,
	isProduction: boolean
): ContactEmailPayload => {
	const subject = 'お問い合わせを承りました（Orchestra Canvas Tokyo）';
	const payload: ContactEmailPayload = {
		from: 'お問い合わせフォーム <webadmin@orch-canvas.tokyo>',
		to: [content.email],
		subject: isProduction ? subject : `【テスト環境】${subject}`,
		text: generateContactTextBody(content),
		html: generateContactHtmlBody(content)
	};

	if (!isProduction) return payload;

	const recipients = getInternalRecipients(content.categoryKey);
	return { ...payload, cc: recipients, reply_to: recipients };
};

export const sendContactEmail = async (
	content: ContactMailContent,
	options: {
		apiKey: string;
		isProduction: boolean;
		idempotencyKey: string;
		fetch?: typeof fetch;
	}
): Promise<void> => {
	const response = await (options.fetch ?? fetch)(resendEndpoint, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${options.apiKey}`,
			'Content-Type': 'application/json',
			'Idempotency-Key': `contact/${options.idempotencyKey}`,
			'User-Agent': 'orchestra-canvas-tokyo-homepage/1.0'
		},
		body: JSON.stringify(buildContactEmailPayload(content, options.isProduction)),
		signal: AbortSignal.timeout(requestTimeoutMs)
	});

	if (!response.ok) {
		throw new Error(`Resend API failed with status ${response.status}`);
	}
};

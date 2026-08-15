import { categories, type ContactCategoryKey, type ContactRequest } from '$lib/contact/form';

const resendEndpoint = 'https://api.resend.com/emails';
const requestTimeoutMs = 10_000;
const emailBannerUrl = 'https://pub-0aeda23dde5e4ea894ce7d8b49189414.r2.dev/header-banner.png';
const emailFontFamily =
	"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Yu Gothic', Meiryo, sans-serif";

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
		? `<p style="margin:0 0 24px;font-family:${emailFontFamily};font-size:16px;line-height:1.8;letter-spacing:0.06em;color:#ffffff;">${escapeHtml(content.name)}さま</p>`
		: '';
	const category = escapeHtml(categories[content.categoryKey]);
	const body = escapeHtml(content.body).replaceAll('\n', '<br />');

	return `<!doctype html>
	<html lang="ja">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="x-apple-disable-message-reformatting" />
		<meta http-equiv="x-ua-compatible" content="ie=edge" />
		<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
		<title>お問い合わせを承りました。</title>
		<style>
			@media only screen and (max-width: 600px) {
				.email-container { width: 100% !important; }
				.email-header { padding: 40px 20px 36px !important; }
				.email-content { padding: 0 20px 48px !important; }
				.email-heading { font-size: 24px !important; line-height: 1.5 !important; }
				.detail-label,
				.detail-value { display: block !important; width: 100% !important; }
				.detail-label { padding: 0 0 4px !important; }
				.detail-value { padding: 0 0 20px !important; }
			}
		</style>
	</head>
	<body style="width:100%;margin:0;padding:0;background-color:#0a0606;">
		<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">ホームページより、お問い合わせを承りました。</div>
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0a0606" style="width:100%;border-collapse:collapse;background-color:#0a0606;">
			<tr>
				<td align="center" style="margin:0;padding:0;">
					<!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
					<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="email-container" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#0a0606;">
						<tr>
							<td align="center" class="email-header" style="padding:56px 24px 48px;">
								<img src="${emailBannerUrl}" width="420" alt="Orchestra Canvas Tokyo" style="display:block;width:100%;max-width:420px;height:auto;border:0;outline:none;text-decoration:none;" />
							</td>
						</tr>
						<tr>
							<td class="email-content" style="padding:0 24px 64px;">
								<h1 class="email-heading" style="margin:0 0 48px;font-family:${emailFontFamily};font-size:28px;font-weight:400;line-height:1.5;letter-spacing:0.08em;color:#ffffff;">お問い合わせを承りました。</h1>
								${recipientLine}
								<p style="margin:0 0 24px;font-family:${emailFontFamily};font-size:16px;line-height:1.8;letter-spacing:0.06em;color:#ffffff;">Orchestra Canvas Tokyoです。<br />ホームページより、お問い合わせを承りました。</p>
								<p style="margin:0;font-family:${emailFontFamily};font-size:16px;line-height:1.8;letter-spacing:0.06em;color:#ffffff;">必要に応じてメールにてご返答いたします。<br />なお、メールアドレスが正しく入力されていない場合、返答いたしかねます。ご了承ください。</p>
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
									<tr>
										<td height="40" style="height:40px;font-size:0;line-height:0;">&nbsp;</td>
									</tr>
									<tr>
										<td height="1" style="height:1px;background-color:#666666;font-size:0;line-height:0;">&nbsp;</td>
									</tr>
									<tr>
										<td height="40" style="height:40px;font-size:0;line-height:0;">&nbsp;</td>
									</tr>
								</table>
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
									<tr>
										<td width="96" valign="top" class="detail-label" style="width:96px;padding:0 20px 16px 0;font-family:${emailFontFamily};font-size:16px;font-weight:600;line-height:1.8;letter-spacing:0.06em;color:#ffffff;">種類</td>
										<td valign="top" class="detail-value" style="padding:0 0 16px;font-family:${emailFontFamily};font-size:16px;line-height:1.8;letter-spacing:0.06em;color:#ffffff;word-break:break-word;">${category}</td>
									</tr>
									<tr>
										<td width="96" valign="top" class="detail-label" style="width:96px;padding:0 20px 0 0;font-family:${emailFontFamily};font-size:16px;font-weight:600;line-height:1.8;letter-spacing:0.06em;color:#ffffff;">本文</td>
										<td valign="top" class="detail-value" style="padding:0;font-family:${emailFontFamily};font-size:16px;line-height:1.8;letter-spacing:0.06em;color:#ffffff;word-break:break-word;">${body}</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
					<!--[if mso]></td></tr></table><![endif]-->
				</td>
			</tr>
		</table>
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

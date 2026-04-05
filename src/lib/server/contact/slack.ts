import { categories, type ContactRequest } from '$lib/contact/form';

const escapeSlackText = (value: string): string =>
	value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const sendSlackNotification = async (
	content: Pick<ContactRequest, 'name' | 'email' | 'categoryKey' | 'body'>,
	webhookUrl: string,
	options: { isProduction: boolean }
): Promise<void> => {
	const prefix = options.isProduction ? '' : '【テスト環境】';
	const message = {
		blocks: [
			{
				type: 'header',
				text: {
					type: 'plain_text',
					text: `${prefix}ホームページのお問い合わせフォームから新規お問い合わせ`,
					emoji: true
				}
			},
			{
				type: 'section',
				fields: [
					{
						type: 'mrkdwn',
						text: `*名前:*\n${escapeSlackText(content.name || '未入力')}`
					},
					{
						type: 'mrkdwn',
						text: `*メール:*\n${escapeSlackText(content.email)}`
					},
					{
						type: 'mrkdwn',
						text: `*分類:*\n${escapeSlackText(categories[content.categoryKey])}`
					}
				]
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*本文:*\n${escapeSlackText(content.body)}`
				}
			}
		]
	};

	const response = await fetch(webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	});

	if (!response.ok) {
		throw new Error(`Slack API responded with status: ${response.status}`);
	}
};

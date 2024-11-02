import { Resend } from 'resend';
import type { RequestData } from './validator';

export async function sendEmail(content: RequestData, apiKey: string) {
	const resend = new Resend(apiKey);
	await resend.emails.send({
		from: 'お問い合わせフォーム <contact.no-reply@orch-canvas.tokyo>',
		to: ['mariokokun@gmail.com'],
		subject: 'test mail via resend',
		html: '<h1>Hello, world!</h1>'
	});
}

import { describe, expect, it } from 'vitest';
import {
	buildContactEmailPayload,
	generateContactHtmlBody,
	generateContactTextBody,
	getInternalRecipients
} from '../email';

const sampleContent = {
	name: '山田 太郎',
	email: 'taro@example.com',
	categoryKey: 'advertisement' as const,
	body: 'お問い合わせ本文です。\n二行目です。'
};

describe('contact email payloads', () => {
	it('本番環境では内部宛先を CC / Reply-To に含める', async () => {
		const payload = await buildContactEmailPayload(sampleContent, true);

		expect(payload.to).toEqual(['taro@example.com']);
		expect(payload.cc).toEqual(getInternalRecipients('advertisement'));
		expect(payload.replyTo).toEqual(getInternalRecipients('advertisement'));
		expect(payload.subject).toBe('お問い合わせを承りました（Orchestra Canvas Tokyo）');
	});

	it('プレビュー環境では内部宛先を付与せず件名にプレフィックスを付ける', async () => {
		const payload = await buildContactEmailPayload(sampleContent, false);

		expect(payload.subject).toBe(
			'【テスト環境】お問い合わせを承りました（Orchestra Canvas Tokyo）'
		);
		expect(payload.cc).toBeUndefined();
		expect(payload.replyTo).toBeUndefined();
	});

	it('本文テキストは宛名とカテゴリを含む', () => {
		const textBody = generateContactTextBody(sampleContent);

		expect(textBody).toContain('山田 太郎さま');
		expect(textBody).toContain('挟み込みについて');
		expect(textBody).toContain('お問い合わせ本文です。');
	});

	it('HTML 本文では名前未入力時の宛名を省略する', async () => {
		const htmlBody = await generateContactHtmlBody({
			...sampleContent,
			name: ''
		});

		expect(htmlBody).not.toContain('さま');
		expect(htmlBody).toContain('お問い合わせを承りました。');
	});
});

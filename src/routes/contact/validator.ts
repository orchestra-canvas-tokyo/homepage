import { z } from 'zod';

export const categories = [
	{ key: 'concert, ticket', description: '演奏会、チケットについて' },
	{ key: 'advertisement', description: '挟み込みについて' },
	{ key: 'hp, sns', description: 'ホームページ、SNSについて' },
	{ key: 'others', description: 'その他' }
];
export const maxBodyLength = 1000;

const schema = z.object({
	name: z.string(),
	mailAddress: z.string().email(),
	category: z.string().refine((arg) => categories.some((category) => arg === category.key)),
	body: z.string().max(maxBodyLength),
	csrfToken: z.string().uuid(),
	reCaptchaToken: z.string()
});
export type RequestData = z.infer<typeof schema>;

export function validate(values: Record<string, unknown>) {
	const result = schema.safeParse(values);
	return result;
}

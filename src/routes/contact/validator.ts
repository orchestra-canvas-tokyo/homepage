import { z } from 'zod';

export const statusScheme = z
	.enum(['received', 'invalid csrf', 'invalid captcha', 'failed to log', 'have sent email'])
	.brand<'Status'>();
export type Status = z.infer<typeof statusScheme>;

const categoryKeyScheme = z
	.enum(['concert, ticket', 'advertisement', 'hp, sns', 'others'])
	.brand<'Category'>();
export type CategoryKey = z.infer<typeof categoryKeyScheme>;

export const categories: Record<string, string> = {
	'concert, ticket': '演奏会、チケットについて',
	advertisement: '挟み込みについて',
	'hp, sns': 'ホームページ、SNSについて',
	others: 'その他'
} as Record<CategoryKey, string>;

export const maxBodyLength = 1000;

const requestBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	categoryKey: categoryKeyScheme,
	body: z.string().max(maxBodyLength),
	csrfToken: z.string().uuid(),
	reCaptchaToken: z.string()
});
export type RequestBody = z.infer<typeof requestBodySchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logSchema = requestBodySchema.extend({
	id: z.string().uuid(),
	sentAt: z.string().datetime(),
	status: statusScheme
});
export type Log = z.infer<typeof logSchema>;

export function validate(values: Record<string, unknown>) {
	const result = requestBodySchema.safeParse(values);
	return result;
}

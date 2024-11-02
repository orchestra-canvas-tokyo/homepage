import { z } from 'zod';

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

const schema = z.object({
	name: z.string(),
	email: z.string().email(),
	categoryKey: categoryKeyScheme,
	body: z.string().max(maxBodyLength),
	csrfToken: z.string().uuid(),
	reCaptchaToken: z.string()
});
export type RequestData = z.infer<typeof schema>;

export function validate(values: Record<string, unknown>) {
	const result = schema.safeParse(values);
	return result;
}

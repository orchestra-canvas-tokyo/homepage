import { z } from 'zod';

export const categories = {
	'concert, ticket': '演奏会、チケットについて',
	advertisement: '挟み込みについて',
	'hp, sns': 'ホームページ、SNSについて',
	others: 'その他'
} as const;

export type ContactCategoryKey = keyof typeof categories;

export const maxNameLength = 100;
export const maxBodyLength = 1000;

const isContactCategoryKey = (value: string): value is ContactCategoryKey =>
	Object.hasOwn(categories, value);

const contactCategoryKeySchema = z
	.string()
	.refine(isContactCategoryKey, '種類を選択してください。')
	.transform((value) => value as ContactCategoryKey);

const toStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');

export type ContactFormValues = {
	name: string;
	email: string;
	categoryKey: string;
	body: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues | 'reCaptchaToken', string>>;

export type ContactActionData = {
	success: boolean;
	message: string;
	values?: ContactFormValues;
	errors?: ContactFormErrors;
};

export const emptyContactFormValues = (): ContactFormValues => ({
	name: '',
	email: '',
	categoryKey: '',
	body: ''
});

export const pickContactFormValues = (values: Record<string, unknown>): ContactFormValues => ({
	name: toStringValue(values.name),
	email: toStringValue(values.email),
	categoryKey: toStringValue(values.categoryKey),
	body: toStringValue(values.body)
});

const contactRequestSchema = z.object({
	name: z
		.string()
		.trim()
		.max(maxNameLength, `お名前は${maxNameLength}文字以内で入力してください。`),
	email: z.string().trim().email('メールアドレスの形式を確認してください。'),
	categoryKey: contactCategoryKeySchema,
	body: z
		.string()
		.trim()
		.min(1, '本文を入力してください。')
		.max(maxBodyLength, `本文は${maxBodyLength}文字以内で入力してください。`),
	reCaptchaToken: z.string().min(1, 'reCAPTCHA の検証に失敗しました。')
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

export const validateContactRequest = (values: Record<string, unknown>) =>
	contactRequestSchema.safeParse({
		name: toStringValue(values.name),
		email: toStringValue(values.email),
		categoryKey: toStringValue(values.categoryKey),
		body: toStringValue(values.body),
		reCaptchaToken: toStringValue(values.reCaptchaToken)
	});

export const flattenContactFormErrors = (error: z.ZodError<ContactRequest>): ContactFormErrors => {
	const fieldErrors = error.flatten().fieldErrors;

	return {
		name: fieldErrors.name?.[0],
		email: fieldErrors.email?.[0],
		categoryKey: fieldErrors.categoryKey?.[0],
		body: fieldErrors.body?.[0],
		reCaptchaToken: fieldErrors.reCaptchaToken?.[0]
	};
};

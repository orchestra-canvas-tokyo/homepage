import { RECAPTCHA_SECRET } from '$env/static/private';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { validate } from './validator';
import { log } from './logger';

export const load: ServerLoad = async ({ locals }) => {
	const { session } = locals;
	if (session.data.csrfToken === undefined) {
		await session.setData({
			csrfToken: crypto.randomUUID()
		});
		await session.save();
	}

	return {
		csrfToken: session.data.csrfToken
	};
};

export const actions = {
	default: async ({ request, locals, platform }) => {
		const { session } = locals;

		const rawRequest: Record<string, FormDataEntryValue> = {};
		(await request.formData()).forEach((value, key) => {
			rawRequest[key] = value;
		});

		// バリデーション
		const validationResult = validate(rawRequest);
		if (!validationResult.success) return { success: false, message: 'Invalid request body' };
		const validatedRequest = validationResult.data;

		// csrfトークンを検証
		if (session.data.csrfToken !== validatedRequest.csrfToken)
			return { success: false, message: 'Invalid csrf token' };

		// reCAPTCHAトークンを検証
		const body = new FormData();
		body.append('secret', RECAPTCHA_SECRET);
		body.append('response', validatedRequest.reCaptchaToken);
		const response = await (
			await fetch('https://www.google.com/recaptcha/api/siteverify', {
				body: body,
				method: 'POST'
			})
		).json();
		if (!response?.success) {
			return { success: false, message: 'Invalid reCaptcha token' };
		}

		// データベースにログ
		const loggingResult = await log(platform?.env.DB, {
			sentAt: new Date().toISOString(),
			...validatedRequest
		});
		console.log({ loggingResult });

		return { success: true };
	}
} satisfies Actions;

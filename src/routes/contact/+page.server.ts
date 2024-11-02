import type { Actions, ServerLoad } from '@sveltejs/kit';
import { validate } from './validator';
import { log } from './logger';
import { verifyCaptcha } from './capthaVerfier';
import { sendEmail } from './emailSender';

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

		if (platform?.env.RECAPTCHA_SECRET === undefined || platform?.env.RESEND_API_KEY === undefined)
			return { success: false, message: 'Invalid system environment' };

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
		const captchaResult = await verifyCaptcha(
			validatedRequest.reCaptchaToken,
			platform?.env.RECAPTCHA_SECRET
		);
		if (!captchaResult) return { success: false, message: 'Invalid reCAPTCHA token' };

		// データベースにログ
		const loggingResult = await log(platform?.env.DB, {
			sentAt: new Date().toISOString(),
			...validatedRequest
		});
		if (!loggingResult.success) return { success: false, message: 'Failed to log' };

		// メール送信
		sendEmail(validatedRequest, platform.env.RESEND_API_KEY);

		return { success: true };
	}
} satisfies Actions;

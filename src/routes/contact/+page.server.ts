import { RECAPTCHA_SECRET } from '$env/static/private';
import type { Actions, ServerLoad } from '@sveltejs/kit';

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
	default: async ({ request, locals }) => {
		const { session } = locals;

		const data = await request.formData();
		const requestData: Record<string, FormDataEntryValue> = {};
		data.forEach((value, key) => {
			requestData[key] = value;
		});

		// csrfトークンを検証
		if (session.data.csrfToken !== requestData?.csrfToken)
			return { success: false, message: 'Invalid csrf token' };

		// reCAPTCHAトークンを検証
		if (!requestData?.reCaptchaToken || typeof requestData.reCaptchaToken !== 'string') {
			return { success: false, message: 'Invalid reCaptcha token' };
		}
		const body = new FormData();
		body.append('secret', RECAPTCHA_SECRET);
		body.append('response', requestData.reCaptchaToken);

		const response = await (
			await fetch('https://www.google.com/recaptcha/api/siteverify', {
				body: body,
				method: 'POST'
			})
		).json();

		if (!response?.success) {
			return { success: false, message: 'Invalid reCaptcha token' };
		}

		return { success: true };
	}
} satisfies Actions;

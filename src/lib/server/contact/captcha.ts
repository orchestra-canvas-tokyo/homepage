import { contactTurnstileAction } from '$lib/contact/captcha';

export const verifyTurnstile = async (
	token: string,
	secret: string,
	remoteIp?: string | null
): Promise<boolean> => {
	const body = new FormData();
	body.append('secret', secret);
	body.append('response', token);
	if (remoteIp) {
		body.append('remoteip', remoteIp);
	}

	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body
	});

	if (!response.ok) {
		throw new Error(`Failed to verify Turnstile: ${response.status} ${response.statusText}`);
	}

	const result = (await response.json()) as { success?: boolean; action?: string };
	return result.success === true && result.action === contactTurnstileAction;
};

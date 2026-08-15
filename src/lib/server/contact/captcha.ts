import { contactTurnstileAction, maxTurnstileTokenLength } from '$lib/contact/captcha';

const turnstileEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const requestTimeoutMs = 10_000;

type TurnstileResponse = {
	success?: boolean;
	hostname?: string;
	action?: string;
	metadata?: { result_with_testing_key?: boolean };
};

export const verifyTurnstile = async (options: {
	token: string;
	secret: string;
	expectedHostnames: string[];
	remoteIp?: string | null;
	idempotencyKey: string;
	allowTestingResponse?: boolean;
	fetch?: typeof fetch;
}): Promise<boolean> => {
	if (
		options.token.length === 0 ||
		options.token.length > maxTurnstileTokenLength ||
		options.expectedHostnames.length === 0
	) {
		return false;
	}

	const body = new URLSearchParams({
		secret: options.secret,
		response: options.token,
		idempotency_key: options.idempotencyKey
	});
	if (options.remoteIp) body.set('remoteip', options.remoteIp);

	const response = await (options.fetch ?? fetch)(turnstileEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body,
		signal: AbortSignal.timeout(requestTimeoutMs)
	});

	if (!response.ok) {
		throw new Error(`Turnstile Siteverify failed with status ${response.status}`);
	}

	const result = (await response.json()) as TurnstileResponse;
	const hostname = result.hostname?.toLowerCase();
	const isDocumentedTestingResponse =
		options.allowTestingResponse === true &&
		result.success === true &&
		result.metadata?.result_with_testing_key === true &&
		hostname === 'example.com' &&
		result.action === undefined;

	return (
		isDocumentedTestingResponse ||
		(result.success === true &&
			result.action === contactTurnstileAction &&
			hostname !== undefined &&
			options.expectedHostnames.includes(hostname))
	);
};

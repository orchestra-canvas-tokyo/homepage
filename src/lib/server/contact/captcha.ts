export const verifyRecaptcha = async (token: string, secret: string): Promise<boolean> => {
	const body = new FormData();
	body.append('secret', secret);
	body.append('response', token);

	const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		body
	});

	if (!response.ok) {
		throw new Error(`Failed to verify reCAPTCHA: ${response.status} ${response.statusText}`);
	}

	const result = (await response.json()) as { success?: boolean };
	return result.success === true;
};

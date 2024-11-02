export async function verifyCaptcha(token: string, secret: string): Promise<boolean> {
	const body = new FormData();
	body.append('secret', secret);
	body.append('response', token);
	const response = await (
		await fetch('https://www.google.com/recaptcha/api/siteverify', {
			body: body,
			method: 'POST'
		})
	).json();

	if (response?.success) return true;
	return false;
}

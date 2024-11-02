import type { ServerLoad } from '@sveltejs/kit';

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

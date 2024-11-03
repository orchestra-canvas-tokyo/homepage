import type { RequestHandler } from './$types';

export const GET: RequestHandler = (({ platform }) => {
	return new Response(JSON.stringify({ platform: Object.keys(Object(platform?.env)) }));
}) satisfies RequestHandler;

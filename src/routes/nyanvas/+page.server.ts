import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { NYANVAS_LATEST_PATH } from '$lib/nyanvasPaths';

export const load: PageServerLoad = async ({ url }) => {
	throw redirect(307, `${NYANVAS_LATEST_PATH}${url.search}`);
};

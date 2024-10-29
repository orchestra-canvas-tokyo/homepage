import type { PageServerLoad } from './$types';
import { concerts } from '$lib/concerts';
export const load: PageServerLoad = async () => {
	// 演奏会一覧をそのまま返す
	return { concerts: concerts };
};

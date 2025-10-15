import type { PageServerLoad } from './$types';
import { concerts } from '$lib/concerts';
export const load: PageServerLoad = async () => {
	// 演奏会をすべて取得する
	return { concerts };
};

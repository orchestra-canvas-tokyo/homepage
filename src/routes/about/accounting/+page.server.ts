import type { PageServerLoad } from './$types';
import { reports } from '$lib/accounting';
export const load: PageServerLoad = async () => {
	// 報告書一覧をそのまま返す
	return { reports: reports };
};

import { newsItems } from '$lib/news';
import type { PageServerLoad } from '../$types';
export const load: PageServerLoad = async () => {
	// ニュース一覧をそのまま返す
	return { newsItems: newsItems };
};

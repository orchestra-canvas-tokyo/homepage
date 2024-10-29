import type { LayoutServerLoad } from './$types';
import { concerts } from '$lib/concerts';
export const load: LayoutServerLoad = async ({ url }) => {
	return {
		concerts: concerts, // メニュー項目の演奏会抽出に使用
		isRoot: url.pathname === '/' // ルートページだけレイアウトを出しわけるために使用
	};
};

import type { LayoutServerLoad } from './$types';
import { dev } from '$app/environment';
import { concerts } from '$lib/concerts';
import {
	SEASONAL_COOKIE_NAME,
	getActiveSeasonalEvent,
	getSeasonalOverrideAction,
	normalizeSeasonalOverride
} from '$lib/seasonalEvents';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
	const seasonalOverrideAction = getSeasonalOverrideAction(url);
	let overrideEventId = normalizeSeasonalOverride(cookies.get(SEASONAL_COOKIE_NAME));

	if (seasonalOverrideAction.type === 'set') {
		overrideEventId = seasonalOverrideAction.eventId;
		cookies.set(SEASONAL_COOKIE_NAME, overrideEventId, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			secure: !dev
		});
	} else if (seasonalOverrideAction.type === 'clear') {
		overrideEventId = null;
		cookies.delete(SEASONAL_COOKIE_NAME, {
			path: '/'
		});
	}

	return {
		concerts: concerts, // メニュー項目の演奏会抽出に使用
		isRoot: url.pathname === '/', // ルートページだけレイアウトを出しわけるために使用
		seasonalEvent: getActiveSeasonalEvent({ overrideEventId })
	};
};

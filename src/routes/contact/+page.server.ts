import type { PageServerLoad } from './$types';
import { getNextConcert, isConcertDatePassed } from '$lib/concerts/getNextConcert';

export const load: PageServerLoad = async () => {
	const nextConcert = getNextConcert();

	// 直近の演奏会があり、演奏会当日以前で、かつ挟み込み募集が終了している場合
	let shouldShowFlyerInsertionClosedNotice = false;

	if (nextConcert) {
		const isDatePassed = isConcertDatePassed(nextConcert);
		const isInsertionClosed = nextConcert.flyerInsertionClosed === true;

		// 演奏会当日以降の場合は通知を表示しない
		shouldShowFlyerInsertionClosedNotice = !isDatePassed && isInsertionClosed;
	}

	return {
		nextConcert,
		shouldShowFlyerInsertionClosedNotice
	};
};

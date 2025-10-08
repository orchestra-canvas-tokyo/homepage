import type { PageServerLoad } from './$types';
import { getNextConcert, isConcertDatePassed } from '$lib/concerts/getNextConcert';

export const load: PageServerLoad = async () => {
	const nextConcert = getNextConcert();

	// 直近の挟み込み終了している演奏会
	let shouldShowFlyerInsertionClosedNotice = 'regular-14';

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

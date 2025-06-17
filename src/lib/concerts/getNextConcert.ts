import dayjs from 'dayjs';
import { concerts } from './index';
import type { Concert } from './types';

/**
 * 今日以降で最も近い演奏会を取得する
 *
 * @returns 次の演奏会、または見つからない場合はundefined
 */
export function getNextConcert(): Concert | undefined {
	const today = dayjs().startOf('day');

	// 今日以降の演奏会を抽出し、開催日昇順でソート
	const upcomingConcerts = concerts
		.filter((concert) => {
			const concertDate = dayjs(concert.dateTime.date).startOf('day');
			return concertDate.isAfter(today) || concertDate.isSame(today);
		})
		.sort((a, b) => (dayjs(a.dateTime.date).isBefore(dayjs(b.dateTime.date)) ? -1 : 1));

	return upcomingConcerts[0];
}

/**
 * 指定した演奏会が演奏会当日以降かどうかを判定する
 *
 * @param concert 判定する演奏会
 * @returns 演奏会当日以降の場合true
 */
export function isConcertDatePassed(concert: Concert): boolean {
	const today = dayjs().startOf('day');
	const concertDate = dayjs(concert.dateTime.date).startOf('day');

	return concertDate.isBefore(today) || concertDate.isSame(today);
}

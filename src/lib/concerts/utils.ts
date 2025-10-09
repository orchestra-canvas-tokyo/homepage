import dayjs from 'dayjs';
import { concerts } from './index';
import type { Concert } from './types';

/**
 * slugで指定した演奏会を取得する
 *
 * @param slug 取得したい演奏会のslug
 * @returns Concertオブジェクト。一致がない場合はundefined
 */

export function getConcertBySlug(slug: string): Concert | undefined {
	return concerts.find((c) => c.slug === slug);
}

/**
 * 指定した演奏会がが終了したかを判定する
 *
 * @param concert 判定する演奏会
 * @returns 今日が演奏会翌日～の場合true
 */
export function isFinished(concert: Concert): boolean {
	const today = dayjs().startOf('day');
	const concertDate = dayjs(concert.dateTime.date).startOf('day');

	return today.isAfter(concertDate);
}

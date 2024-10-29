import dayjs from 'dayjs';
import type { Concert, ConcertType, EncorType } from './types';

/**
 * 画面表示に適した形式の演奏会開催日文字列を生成する
 *
 * e.g.
 * - 2024年10月25日(月)
 * - 2024年10月14日(月祝)
 *
 * @param concert 開催日を取得するConcert
 * @returns 開催年月日＋曜日
 */
export function getConcertDateDayToDisplay(concert: Concert) {
	if (concert.dateTime.day) {
		const displayingDateWithoutDay = dayjs(concert.dateTime.date)
			.locale('ja')
			.format('YYYY年M月D日');
		return `${displayingDateWithoutDay}${concert.dateTime.day}`;
	}
	return dayjs(concert.dateTime.date).locale('ja').format('YYYY年M月D日(ddd)');
}

/**
 * 演奏会種別の表示名を取得する
 * @param type 演奏会種別
 * @returns 「演奏会」を除いた演奏会種別名
 */
export function getConcertShortName(type: ConcertType) {
	return {
		regular: '定期',
		chamber: '室内楽'
	}[type];
}

/**
 * アンコール種別の表示名を取得する
 * @param type アンコール種別
 * @returns アンコール種別名
 */
export function getEncorName(type: EncorType) {
	return {
		standard: 'アンコール',
		soloist: 'ソリストアンコール'
	}[type];
}

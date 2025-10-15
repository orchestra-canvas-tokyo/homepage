import type { PageServerLoad } from './$types';
import { getConcertBySlug, isFinished } from '$lib/concerts/utils';

export const load: PageServerLoad = async () => {
	// 挟み込み募集・募集終了案内の表示設定
	const flyerInsertionData: Parameters<typeof getFlyerInsertionStatus> = [
		{
			concertSlug: 'regular-15',
			status: 'recruiting'
		}
	];
	const flyerInsertionStatus = getFlyerInsertionStatus(...flyerInsertionData);

	return {
		flyerInsertionStatus
	};
};

/**
 * # 挟み込み募集案内の詳細仕様
 *
 * 挟み込み: flyer insertion
 *
 * ## 想定されるケース
 *
 * ### パターン1
 *
 * 1. 挟み込み募集案内が掲載される
 * 2. 演奏会終了とともに、挟み込み募集案内は掲載終了する
 *
 * ### パターン2
 *
 * 1. 挟み込み募集案内が掲載される
 * 2. 挟み込み募集終了案内が掲載される
 * 3. 演奏会終了とともに、挟み込み募集終了案内は掲載終了する
 *
 * ## 方針
 *
 * `+page.svelte` には次の3パターンのいずれなのかを伝達する
 *
 * - 案内掲載なし
 * - 挟み込み募集案内を掲載
 * - 挟み込み募集終了案内を掲載
 *
 * 特に、案内を掲載するときは何の演奏会の案内なのかを併せて伝える
 *
 * ## 処理の流れ
 *
 * 1. 情報収集
 *   - 案内対象の演奏会を指定
 *   - 案内状況を指定（募集中、募集終了）
 *   - 案内対象の演奏会の開催日を取得
 *
 * 2. 条件分岐
 * |                    | 案内状況：募集中 | 案内状況：募集終了 |
 * | ------------------ | ---------------- | ------------------ |
 * | ～指定の演奏会当日 | 募集案内を掲載   | 募集終了案内を掲載 |
 * | 指定の演奏会翌日～ | 掲載なし         | 掲載なし           |
 */
function getFlyerInsertionStatus(data: {
	concertSlug: string;
	status: 'recruiting' | 'recruitmentClosed';
}):
	| {
			status: 'notAvailable';
	  }
	| {
			status: 'recruiting' | 'recruitmentClosed';
			concertTitle: string;
	  } {
	// 挟み込み案内対象演奏会に関する情報を取得
	const targetConcert = getConcertBySlug(data.concertSlug);

	// 対象演奏会が無効の場合、掲載なし
	if (targetConcert === undefined) return { status: 'notAvailable' };

	// 仕様の表に従って条件分岐
	if (isFinished(targetConcert)) {
		return { status: 'notAvailable' };
	}
	if (data.status === 'recruiting') {
		return { status: 'recruiting', concertTitle: targetConcert.title };
	}
	return { status: 'recruitmentClosed', concertTitle: targetConcert.title };
}

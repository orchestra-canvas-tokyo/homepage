import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	flattenContactFormErrors,
	pickContactFormValues,
	validateContactRequest,
	type ContactActionData
} from '$lib/contact/form';
import { getConcertBySlug, isFinished } from '$lib/concerts/utils';
import { resolveContactRuntimeConfig } from '$lib/server/contact/config';
import { submitContactForm } from '$lib/server/contact/submit';

export const load: PageServerLoad = async ({ platform }) => {
	const flyerInsertionData: Parameters<typeof getFlyerInsertionStatus> = [
		{
			concertSlug: 'regular-15',
			status: 'onlyRecruitmentClosed'
		}
	];
	const flyerInsertionStatus = getFlyerInsertionStatus(...flyerInsertionData);
	const { reCaptchaSiteKey } = resolveContactRuntimeConfig(platform?.env);

	return {
		flyerInsertionStatus,
		reCaptchaSiteKey
	};
};

export const actions = {
	default: async ({ request, platform }) => {
		const rawValues: Record<string, FormDataEntryValue> = {};
		(await request.formData()).forEach((value, key) => {
			rawValues[key] = value;
		});

		const values = pickContactFormValues(rawValues);
		const validationResult = validateContactRequest(rawValues);
		if (!validationResult.success) {
			return fail(400, {
				success: false,
				message: '入力内容を確認してください。',
				values,
				errors: flattenContactFormErrors(validationResult.error)
			} satisfies ContactActionData);
		}

		const result = await submitContactForm(
			validationResult.data,
			resolveContactRuntimeConfig(platform?.env)
		);
		if (!result.ok) {
			return fail(
				result.reason === 'configuration' ? 503 : result.reason === 'invalid_captcha' ? 400 : 502,
				{
					success: false,
					message: result.message,
					values
				} satisfies ContactActionData
			);
		}

		return {
			success: true,
			message: result.message
		} satisfies ContactActionData;
	}
} satisfies Actions;

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
 * |                    | 案内状況：募集中 | 案内状況：募集終了（挟み込みのみ・すべて） |
 * | ------------------ | ---------------- | ------------------------------------------ |
 * | ～指定の演奏会当日 | 募集案内を掲載   | 募集終了案内を掲載                         |
 * | 指定の演奏会翌日～ | 掲載なし         | 掲載なし                                   |
 */
function getFlyerInsertionStatus(data: {
	concertSlug: string;
	status: 'recruiting' | 'onlyRecruitmentClosed' | 'allClosed';
}):
	| {
			status: 'notAvailable';
	  }
	| {
			status: 'recruiting' | 'onlyRecruitmentClosed' | 'allClosed';
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
	return { status: data.status, concertTitle: targetConcert.title };
}

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { reports } from '$lib/accounting';

export const load: PageServerLoad = async ({ params }) => {
	const fiscalYearNumber = parseInt(params.year);

	// yearはインデックスでなく、1始まりのカウント
	// 非数だった場合、非整数だった場合、非自然数だった場合、インデックス外だった場合を除外
	const gotoNotFound = () => error(404, 'Not found');
	if (isNaN(fiscalYearNumber)) gotoNotFound();
	if (fiscalYearNumber !== parseFloat(params.year)) gotoNotFound();
	if (fiscalYearNumber <= 0) gotoNotFound();
	if (reports.length < fiscalYearNumber) gotoNotFound();

	const report = reports[fiscalYearNumber - 1];
	return {
		fiscalYearNumber: fiscalYearNumber,
		...report
	};
};

import term1Pdf from './documents/第1期 決算報告書.pdf';
import term2Pdf from './documents/第2期 決算報告書.pdf';
import term3Pdf from './documents/第3期 決算報告書.pdf';
import term4Pdf from './documents/第4期 決算報告書.pdf';
import term4ActivityReportPdf from './documents/第4期 活動収支報告書.pdf';

/** 決算報告についての情報をまとめた配列 */
export const reports: {
	duration: string;
	pdf: string;
	activityReportPdf?: string;
}[] = [
	{
		duration: '2021/4/1～2022/3/31',
		pdf: term1Pdf
	},
	{
		duration: '2022/4/1～2023/3/31',
		pdf: term2Pdf
	},
	{
		duration: '2023/4/1～2024/3/31',
		pdf: term3Pdf
	},
	{
		duration: '2024/4/1～2025/3/31',
		pdf: term4Pdf,
		activityReportPdf: term4ActivityReportPdf
	}
];

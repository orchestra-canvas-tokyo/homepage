import term1Pdf from './documents/第1期_決算報告書.pdf';
import term1ActivityReportPdf from './documents/第1期_活動収支報告書.pdf';
import term2Pdf from './documents/第2期_決算報告書.pdf';
import term2ActivityReportPdf from './documents/第2期_活動収支報告書.pdf';
import term3Pdf from './documents/第3期_決算報告書.pdf';
import term3ActivityReportPdf from './documents/第3期_活動収支報告書.pdf';
import term4Pdf from './documents/第4期_決算報告書.pdf';
import term4ActivityReportPdf from './documents/第4期_活動収支報告書.pdf';
import term5Pdf from './documents/第5期_決算報告書.pdf';
import term5ActivityReportPdf from './documents/第5期_活動収支報告書.pdf';

/** 決算報告についての情報をまとめた配列 */
export const reports: {
	duration: string;
	pdf: string;
	activityReportPdf?: string;
}[] = [
	{
		duration: '2021/4/1～2022/3/31',
		pdf: term1Pdf,
		activityReportPdf: term1ActivityReportPdf
	},
	{
		duration: '2022/4/1～2023/3/31',
		pdf: term2Pdf,
		activityReportPdf: term2ActivityReportPdf
	},
	{
		duration: '2023/4/1～2024/3/31',
		pdf: term3Pdf,
		activityReportPdf: term3ActivityReportPdf
	},
	{
		duration: '2024/4/1～2025/3/31',
		pdf: term4Pdf,
		activityReportPdf: term4ActivityReportPdf
	},
	{
		duration: '2025/4/1～2026/3/31',
		pdf: term5Pdf,
		activityReportPdf: term5ActivityReportPdf
	}
];

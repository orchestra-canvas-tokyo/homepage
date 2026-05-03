import term1Pdf from './documents/第1期 決算報告書.pdf';
import term1ActivityReportPdf from './documents/活動収支報告書_第1期_OrchestraCanvasTokyo.pdf';
import term2Pdf from './documents/第2期 決算報告書.pdf';
import term2ActivityReportPdf from './documents/活動収支報告書_第2期_OrchestraCanvasTokyo.pdf';
import term3Pdf from './documents/第3期 決算報告書.pdf';
import term3ActivityReportPdf from './documents/活動収支報告書_第3期_OrchestraCanvasTokyo.pdf';
import term4Pdf from './documents/第4期 決算報告書.pdf';
import term4ActivityReportPdf from './documents/活動収支報告書_第4期_OrchestraCanvasTokyo.pdf';

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
	}
];

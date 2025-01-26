import term1Pdf from './documents/第1期 決算報告書.pdf';
import term1Image from './documents/第1期 決算報告書.png';
import term2Pdf from './documents/第2期 決算報告書.pdf';
import term2Image from './documents/第2期 決算報告書.png';
import term3Pdf from './documents/第3期 決算報告書.pdf';
import term3Image from './documents/第3期 決算報告書.png';

/** 決算報告書情報をまとめた配列 */
export const reports: {
	duration: string;
	pdf: string;
	image: string;
}[] = [
	{
		duration: '2021/4/1～2022/3/31',
		pdf: term1Pdf,
		image: term1Image
	},
	{
		duration: '2022/4/1～2023/3/31',
		pdf: term2Pdf,
		image: term2Image
	},
	{
		duration: '2023/4/1～2024/3/31',
		pdf: term3Pdf,
		image: term3Image
	}
];

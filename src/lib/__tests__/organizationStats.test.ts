import { describe, expect, it } from 'vitest';
import {
	extractTotalAttendanceFromCsv,
	extractYouTubeChannelStatistics,
	formatAttendanceCount,
	formatAttendanceSummary,
	formatYouTubeSubscriberCount,
	formatYouTubeTotalViewCount,
	hasOrganizationStatsDisplayChange,
	parseCsvText,
	shouldPersistOrganizationStats
} from '../organizationStats';

const attendanceCsv = `,,,,,,,,,,,,,,,,,
演奏会名,日時,会場,一般,当日券,予約,チラシ割引,一般合計,"団員紹介
(0円)","団員紹介
(500円)","招待
(関係者)","招待
(支援)",関係者,その他,当日清算枚数,当日支払い金額,合計来場者,備考
合計,,,,,,,,,,,,,,,,7867,
第1回定期演奏会,2021/8/29(日),所沢市民文化センター ミューズ アークホール,-,-,-,-,-,-,-,-,-,-,-,-,-,0,無観客開催
第2回定期演奏会,2021/11/23(火祝),武蔵野市民文化会館 大ホール,102,-,-,-,102,311,,-,-,-,4,,,417,
第3回定期演奏会,2022/2/23(水祝),所沢市民文化センター ミューズ アークホール,106,-,-,-,106,206,,-,-,-,9,,,321,
第4回定期演奏会,2022/5/29(日),杉並公会堂 大ホール,205,-,-,-,205,433,,24,-,-,-,,,662,
第5回定期演奏会,2022/9/3(土),ミューザ川崎シンフォニーホール,92,-,-,-,92,512,,8,-,-,-,,,612,
第6回定期演奏会,2022/12/4(日),北とぴあ さくらホール,52,-,-,-,52,394,,14,-,-,-,,,460,
第7回定期演奏会,2023/4/8(土),神奈川県立音楽堂,100,-,-,-,100,248,,-,-,-,11,-,,359,
第8回定期演奏会,2023/7/2(日),東京芸術劇場　コンサートホール,249,-,-,,249,673,,-,-,-,41,,,963,
第9回定期演奏会,2023/10/29(日),ミューザ川崎シンフォニーホール,95,-,-,,95,349,,-,-,-,36,,,480,
第10回定期演奏会,2024/02/24(土),東京芸術劇場　コンサートホール,262,27,3,25,317,399,60,9,11,2,-,30,"￥30,000",798,
第9回室内楽演奏会,2024/03/16(土),,,,,,,,,,,,,,,37,全席自由無料
第11回定期演奏会,2024/06/02(日),文京シビックホール 大ホール,175,5,1,3,184,426,286,15,8,3,0,6,"￥6,000",922,
第11回室内楽演奏会,2024/07/06(土),戸塚区民文化センター　さくらプラザ,29,28,-,-,57,-,-,-,-,-,0,-,-,57,全席自由無料
第12回定期演奏会,2024/09/22(日),所沢市民文化センター ミューズ アークホール,48,9,0,4,61,236,21,5,12,2,0,9,"￥9,000",337,
第12回室内楽演奏会,2025/08/31(日),,,,,,,,,,,,,,,,
第13回定期演奏会,2025/02/24(月祝),横浜みなとみらいホール　大ホール,271,31,2,-,304,397,174,7,8,2,0,33,"￥33,000",892,
第13回室内楽演奏会,2025/04/20(日),横浜市鶴見区文化センター　サルビアホール,,,,,,,,,,,,,,,
第14回定期演奏会,2025/07/12(土),練馬区立練馬文化センター 大ホール,159,10,1,0,170,281,81,3,13,2,0,11,"￥11,000",550,
第14回室内楽演奏会,2025/08/17(日),横浜市港北区民文化センター ミズキーホール,,,,,,,,,,,,,,,`;

describe('formatters', () => {
	it('formats attendance counts with a 1,000 visitor floor', () => {
		expect(formatAttendanceCount(7867)).toBe('7,000名');
		expect(formatAttendanceSummary(7867)).toBe('7,000名を超える');
	});

	it('formats YouTube subscriber counts in 0.1万 units', () => {
		expect(formatYouTubeSubscriberCount(15000)).toBe('1.5万人');
		expect(formatYouTubeSubscriberCount(20000)).toBe('2万人');
	});

	it('formats YouTube total view counts in 10万 increments', () => {
		expect(formatYouTubeTotalViewCount(6607890)).toBe('660万回');
	});

	it('detects display-only bucket changes', () => {
		expect(
			hasOrganizationStatsDisplayChange(
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890
				},
				{
					totalAttendance: 7999,
					youtubeSubscriberCount: 15999,
					youtubeTotalViewCount: 6699999
				}
			)
		).toBe(false);

		expect(
			hasOrganizationStatsDisplayChange(
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890
				},
				{
					totalAttendance: 8000,
					youtubeSubscriberCount: 16000,
					youtubeTotalViewCount: 6700000
				}
			)
		).toBe(true);
	});

	it('persists the first verified subscriber count even when the display bucket is unchanged', () => {
		expect(
			shouldPersistOrganizationStats(
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890,
					youtubeSubscriberCountVerified: false
				},
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15400,
					youtubeTotalViewCount: 6607890
				}
			)
		).toBe(true);

		expect(
			shouldPersistOrganizationStats(
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15400,
					youtubeTotalViewCount: 6607890,
					youtubeSubscriberCountVerified: true
				},
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15999,
					youtubeTotalViewCount: 6699999
				}
			)
		).toBe(false);
	});
});

describe('attendance CSV parsing', () => {
	it('parses CSV rows with quoted newlines', () => {
		const rows = parseCsvText(attendanceCsv);

		expect(rows[1][8]).toBe('団員紹介\n(0円)');
		expect(rows[1][9]).toBe('団員紹介\n(500円)');
	});

	it('extracts the validated total attendance from the published CSV shape', () => {
		expect(extractTotalAttendanceFromCsv(attendanceCsv)).toBe(7867);
	});

	it('fails when the total attendance column is missing', () => {
		expect(() =>
			extractTotalAttendanceFromCsv(attendanceCsv.replace('合計来場者', '来場者数'))
		).toThrow('合計来場者 column');
	});

	it('fails when the summary row is missing', () => {
		expect(() =>
			extractTotalAttendanceFromCsv(attendanceCsv.replace('\n合計,', '\n総計,'))
		).toThrow('summary row');
	});

	it('fails when the computed total does not match the summary total', () => {
		expect(() => extractTotalAttendanceFromCsv(attendanceCsv.replace(',798,', ',799,'))).toThrow(
			'summary mismatch'
		);
	});
});

describe('YouTube API parsing', () => {
	it('extracts subscriber and view counts from the channels statistics response', () => {
		expect(
			extractYouTubeChannelStatistics({
				items: [
					{
						statistics: {
							subscriberCount: '15000',
							viewCount: '6607890'
						}
					}
				]
			})
		).toEqual({
			youtubeSubscriberCount: 15000,
			youtubeTotalViewCount: 6607890
		});
	});

	it('fails when the response does not contain statistics', () => {
		expect(() => extractYouTubeChannelStatistics({ items: [] })).toThrow(
			'missing channel statistics'
		);
	});
});

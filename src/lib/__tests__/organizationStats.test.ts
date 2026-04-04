import { describe, expect, it } from 'vitest';
import {
	extractTotalAttendanceFromCsv,
	extractYouTubeChannelStatistics,
	formatAttendanceCount,
	formatAttendanceSummary,
	formatYouTubeSubscriberCount,
	formatYouTubeTotalViewCount,
	hasOrganizationStatsDisplayChange,
	shouldPersistOrganizationStats
} from '../organizationStats';

const attendanceCsv = '7867\n';

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
	it('extracts the total attendance from a single-cell CSV', () => {
		expect(extractTotalAttendanceFromCsv(attendanceCsv)).toBe(7867);
	});

	it('extracts the total attendance from a quoted single-cell CSV', () => {
		expect(extractTotalAttendanceFromCsv('"7,867"\n')).toBe(7867);
	});

	it('fails when the CSV is empty', () => {
		expect(() => extractTotalAttendanceFromCsv('\n,,\n')).toThrow('Attendance CSV is empty');
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

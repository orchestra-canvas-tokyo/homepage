import { describe, expect, it } from 'vitest';

import {
	createOrganizationStatsErrorSummary,
	formatOrganizationStatsSlackSummary,
	summarizeOrganizationStatsUpdate
} from '../organizationStatsUpdateSummary';

describe('organization stats update summary', () => {
	it('marks raw numeric changes as updated even when display buckets stay the same', () => {
		const summary = summarizeOrganizationStatsUpdate(
			{
				totalAttendance: 7867,
				youtubeSubscriberCount: 15000,
				youtubeTotalViewCount: 6607890,
				youtubeSubscriberCountVerified: true
			},
			{
				totalAttendance: 7999,
				youtubeSubscriberCount: 15999,
				youtubeTotalViewCount: 6699999
			}
		);

		expect(summary).toMatchObject({
			status: 'updated',
			shouldPersist: false,
			persistReasons: []
		});
		expect(
			summary.status === 'error' ? [] : summary.fields.filter((field) => field.changed)
		).toHaveLength(3);
	});

	it('keeps no_change when values match but still persists initial subscriber verification', () => {
		const summary = summarizeOrganizationStatsUpdate(
			{
				totalAttendance: 7867,
				youtubeSubscriberCount: 15000,
				youtubeTotalViewCount: 6607890,
				youtubeSubscriberCountVerified: false
			},
			{
				totalAttendance: 7867,
				youtubeSubscriberCount: 15000,
				youtubeTotalViewCount: 6607890
			}
		);

		expect(summary).toMatchObject({
			status: 'no_change',
			shouldPersist: true,
			persistReasons: ['subscriber_verification']
		});
	});

	it('formats updated summaries with diffs and persistence decisions', () => {
		const text = formatOrganizationStatsSlackSummary(
			summarizeOrganizationStatsUpdate(
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890,
					youtubeSubscriberCountVerified: true
				},
				{
					totalAttendance: 8001,
					youtubeSubscriberCount: 16050,
					youtubeTotalViewCount: 6704321
				}
			),
			{
				runUrl: 'https://example.com/runs/1'
			}
		);

		expect(text).toContain('結果: 更新あり (3項目)');
		expect(text).toContain('累計来場者数: 7,867 -> 8,001 (+134)');
		expect(text).toContain('公開用JSON: 更新対象あり（表示値差分あり）');
		expect(text).toContain('Run: https://example.com/runs/1');
	});

	it('formats workflow failures as errors while preserving fetched values', () => {
		const text = formatOrganizationStatsSlackSummary(
			summarizeOrganizationStatsUpdate(
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890,
					youtubeSubscriberCountVerified: true
				},
				{
					totalAttendance: 7868,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890
				}
			),
			{
				workflowStatus: 'failure',
				failedSteps: ['Create or update main PR']
			}
		);

		expect(text).toContain('結果: エラー');
		expect(text).toContain('Create or update main PR');
		expect(text).toContain('取得できた差分:');
	});

	it('formats update errors directly', () => {
		const text = formatOrganizationStatsSlackSummary(
			createOrganizationStatsErrorSummary('Attendance CSV is empty.')
		);

		expect(text).toContain('結果: エラー');
		expect(text).toContain('Attendance CSV is empty.');
	});
});

import { describe, expect, it } from 'vitest';

import {
	createOrganizationStatsErrorSummary,
	formatOrganizationStatsSlackPayload,
	formatOrganizationStatsSlackSummary,
	getOrganizationStatsSlackColor,
	summarizeOrganizationStatsUpdate
} from '../organizationStatsUpdateSummary';

describe('organization stats update summary', () => {
	const generatedAt = new Date('2026-04-10T02:50:24.893Z');

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
		const payload = formatOrganizationStatsSlackPayload(
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
				generatedAt,
				runUrl: 'https://example.com/runs/1'
			}
		);

		expect(payload.text).toContain('団体情報統計 更新サマリー | 2026-04-09 JST');
		expect(payload.text).toContain('生成: 2026-04-10T02:50:24.893Z');
		expect(payload.text).toContain('サマリー: 🟡 3件更新');
		expect(payload.text).toContain('- 🟡 YT総再生回数 6,704,321回 (+96,431)');
		expect(payload.text).toContain('- 🟡 YT登録者数 16,050人 (+1,050)');
		expect(payload.text).toContain('- 🟡 累計来場者数 8,001名 (+134)');
		expect(payload.text).toContain('公開用JSON: 更新対象あり（表示値差分あり）');
		expect(payload.text).toContain('<https://example.com/runs/1|実行ログ>');
		expect(payload.blocks.slice(0, 4)).toMatchObject([
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: '*団体情報統計 更新サマリー | 2026-04-09 JST*'
				}
			},
			{
				type: 'context',
				elements: [
					{
						type: 'mrkdwn',
						text: '生成: 2026-04-10T02:50:24.893Z'
					}
				]
			},
			{
				type: 'divider'
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: '*サマリー: 🟡 3件更新*'
				}
			}
		]);
	});

	it('formats no-change summaries with current metric values', () => {
		const text = formatOrganizationStatsSlackSummary(
			summarizeOrganizationStatsUpdate(
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
			),
			{
				generatedAt
			}
		);

		expect(text).toContain('サマリー: 🟢 更新なし');
		expect(text).toContain('- 🟢 YT総再生回数 6,607,890回');
		expect(text).toContain('- 🟢 YT登録者数 15,000人');
		expect(text).toContain('- 🟢 累計来場者数 7,867名');
		expect(text).toContain('公開用JSON: 更新対象あり（登録者数検証フラグを確定）');
	});

	it('keeps summary and metric markers green when raw values changed but JSON is not persisted', () => {
		const payload = formatOrganizationStatsSlackPayload(
			summarizeOrganizationStatsUpdate(
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
			),
			{
				generatedAt
			}
		);

		expect(payload.text).toContain('サマリー: 🟢 3件更新');
		expect(payload.text).toContain('- 🟢 YT総再生回数 6,699,999回 (+92,109)');
		expect(payload.text).toContain('- 🟢 YT登録者数 15,999人 (+999)');
		expect(payload.text).toContain('- 🟢 累計来場者数 7,999名 (+132)');
		expect(payload.text).toContain('公開用JSON: 変更なし');
	});

	it('returns warning only when changed values require a persisted JSON update', () => {
		const warningColor = getOrganizationStatsSlackColor(
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
			)
		);
		const goodColor = getOrganizationStatsSlackColor(
			summarizeOrganizationStatsUpdate(
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
			)
		);
		const verificationOnlyColor = getOrganizationStatsSlackColor(
			summarizeOrganizationStatsUpdate(
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
			)
		);

		expect(warningColor).toBe('warning');
		expect(goodColor).toBe('good');
		expect(verificationOnlyColor).toBe('good');
	});

	it('formats workflow failures as errors while preserving fetched values', () => {
		const payload = formatOrganizationStatsSlackPayload(
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
				generatedAt,
				workflowStatus: 'failure',
				failedSteps: ['Create or update main PR']
			}
		);

		expect(payload.text).toContain('サマリー: 🔴 エラー');
		expect(payload.text).toContain('Create or update main PR');
		expect(payload.text).toContain('- 🟢 累計来場者数 7,868名 (+1)');
	});

	it('returns danger for non-success workflow states and direct errors', () => {
		const failedWorkflowColor = getOrganizationStatsSlackColor(
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
				workflowStatus: 'failure'
			}
		);
		const cancelledWorkflowColor = getOrganizationStatsSlackColor(
			summarizeOrganizationStatsUpdate(
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890,
					youtubeSubscriberCountVerified: true
				},
				{
					totalAttendance: 7867,
					youtubeSubscriberCount: 15000,
					youtubeTotalViewCount: 6607890
				}
			),
			{
				workflowStatus: 'cancelled'
			}
		);
		const errorColor = getOrganizationStatsSlackColor(
			createOrganizationStatsErrorSummary('Attendance CSV is empty.')
		);

		expect(failedWorkflowColor).toBe('danger');
		expect(cancelledWorkflowColor).toBe('danger');
		expect(errorColor).toBe('danger');
	});

	it('formats update errors directly', () => {
		const payload = formatOrganizationStatsSlackPayload(
			createOrganizationStatsErrorSummary('Attendance CSV is empty.'),
			{
				generatedAt
			}
		);

		expect(payload.text).toContain('サマリー: 🔴 エラー');
		expect(payload.text).toContain('Attendance CSV is empty.');
		expect(payload.blocks).toHaveLength(4);
	});
});

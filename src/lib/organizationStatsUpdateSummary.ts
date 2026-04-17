import {
	formatAttendanceCount,
	formatYouTubeSubscriberCount,
	formatYouTubeTotalViewCount,
	hasOrganizationStatsDisplayChange,
	shouldPersistOrganizationStats,
	type OrganizationStats,
	type PersistedOrganizationStats
} from './organizationStats.ts';

export type OrganizationStatsFieldKey = keyof OrganizationStats;

export type OrganizationStatsPersistReason = 'display_change' | 'subscriber_verification';

export type OrganizationStatsFieldSummary = {
	key: OrganizationStatsFieldKey;
	label: string;
	previousValue: number;
	nextValue: number;
	delta: number;
	changed: boolean;
	previousDisplayValue: string;
	nextDisplayValue: string;
	displayChanged: boolean;
};

export type OrganizationStatsUpdateSummary =
	| {
			status: 'updated' | 'no_change';
			fields: OrganizationStatsFieldSummary[];
			shouldPersist: boolean;
			persistReasons: OrganizationStatsPersistReason[];
	  }
	| {
			status: 'error';
			errorMessage: string;
	  };

export type OrganizationStatsSlackSummaryOptions = {
	failedSteps?: string[];
	runUrl?: string;
	workflowStatus?: string;
};

export type OrganizationStatsSlackColor = 'good' | 'warning' | 'danger';

export type OrganizationStatsSlackPayload = {
	text: string;
	attachments: [
		{
			color: OrganizationStatsSlackColor;
			fallback: string;
			text: string;
		}
	];
};

const fieldLabels = {
	totalAttendance: '累計来場者数',
	youtubeSubscriberCount: 'YouTube 登録者数',
	youtubeTotalViewCount: 'YouTube 総再生回数'
} satisfies Record<OrganizationStatsFieldKey, string>;

const displayFormatters = {
	totalAttendance: formatAttendanceCount,
	youtubeSubscriberCount: formatYouTubeSubscriberCount,
	youtubeTotalViewCount: formatYouTubeTotalViewCount
} satisfies Record<OrganizationStatsFieldKey, (value: number) => string>;

const organizationStatsKeys = Object.keys(fieldLabels) as OrganizationStatsFieldKey[];

const formatRawInteger = (value: number): string => value.toLocaleString('ja-JP');

const formatSignedInteger = (value: number): string => {
	const prefix = value > 0 ? '+' : value < 0 ? '-' : '';

	return `${prefix}${formatRawInteger(Math.abs(value))}`;
};

const formatPersistDecision = (
	summary: Extract<OrganizationStatsUpdateSummary, { status: 'updated' | 'no_change' }>
): string => {
	if (!summary.shouldPersist) {
		return '公開用JSON: 変更なし';
	}

	const reasons = summary.persistReasons.map((reason) => {
		if (reason === 'display_change') {
			return '表示値差分あり';
		}

		return '登録者数検証フラグを確定';
	});

	return `公開用JSON: 更新対象あり（${reasons.join(' / ')}）`;
};

const formatChangedField = (field: OrganizationStatsFieldSummary): string =>
	`- ${field.label}: ${formatRawInteger(field.previousValue)} -> ${formatRawInteger(field.nextValue)} (${formatSignedInteger(field.delta)}) / 表示: ${field.previousDisplayValue} -> ${field.nextDisplayValue}`;

const formatCurrentField = (field: OrganizationStatsFieldSummary): string =>
	`- ${field.label}: ${formatRawInteger(field.nextValue)} / 表示: ${field.nextDisplayValue}`;

export const createOrganizationStatsErrorSummary = (
	errorMessage: string
): OrganizationStatsUpdateSummary => ({
	status: 'error',
	errorMessage
});

export const summarizeOrganizationStatsUpdate = (
	current: PersistedOrganizationStats,
	next: OrganizationStats
): OrganizationStatsUpdateSummary => {
	const fields = organizationStatsKeys.map((key) => {
		const previousValue = current[key];
		const nextValue = next[key];
		const previousDisplayValue = displayFormatters[key](previousValue);
		const nextDisplayValue = displayFormatters[key](nextValue);

		return {
			key,
			label: fieldLabels[key],
			previousValue,
			nextValue,
			delta: nextValue - previousValue,
			changed: previousValue !== nextValue,
			previousDisplayValue,
			nextDisplayValue,
			displayChanged: previousDisplayValue !== nextDisplayValue
		};
	});

	const persistReasons: OrganizationStatsPersistReason[] = [];

	if (hasOrganizationStatsDisplayChange(current, next)) {
		persistReasons.push('display_change');
	}

	if (!current.youtubeSubscriberCountVerified) {
		persistReasons.push('subscriber_verification');
	}

	return {
		status: fields.some((field) => field.changed) ? 'updated' : 'no_change',
		fields,
		shouldPersist: shouldPersistOrganizationStats(current, next),
		persistReasons
	};
};

export const getOrganizationStatsSlackColor = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions = {}
): OrganizationStatsSlackColor => {
	if (
		summary.status === 'error' ||
		(options.workflowStatus !== undefined && options.workflowStatus !== 'success')
	) {
		return 'danger';
	}

	if (summary.status === 'updated' && summary.shouldPersist) {
		return 'warning';
	}

	return 'good';
};

export const createOrganizationStatsSlackPayload = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions = {}
): OrganizationStatsSlackPayload => {
	const text = formatOrganizationStatsSlackSummary(summary, options);
	const [, ...detailLines] = text.split('\n');

	return {
		text,
		attachments: [
			{
				color: getOrganizationStatsSlackColor(summary, options),
				fallback: text,
				text: detailLines.join('\n')
			}
		]
	};
};

export const formatOrganizationStatsSlackSummary = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions = {}
): string => {
	const lines = ['団体情報の統計更新サマリー'];
	const failedSteps = options.failedSteps?.filter((step) => step !== '') ?? [];

	if (summary.status === 'error') {
		lines.push('結果: エラー');
		lines.push(`詳細: ${summary.errorMessage}`);
	} else if (options.workflowStatus === 'failure') {
		lines.push('結果: エラー');
		lines.push(
			failedSteps.length > 0
				? `詳細: GitHub Actions の後続 step に失敗しました (${failedSteps.join(', ')})`
				: '詳細: GitHub Actions の実行に失敗しました。'
		);

		if (summary.status === 'updated') {
			lines.push('取得できた差分:');
			lines.push(...summary.fields.filter((field) => field.changed).map(formatChangedField));
		} else {
			lines.push('取得できた現在値:');
			lines.push(...summary.fields.map(formatCurrentField));
		}

		lines.push(formatPersistDecision(summary));
	} else if (summary.status === 'updated') {
		const changedFields = summary.fields.filter((field) => field.changed);
		const unchangedFieldLabels = summary.fields
			.filter((field) => !field.changed)
			.map((field) => field.label);

		lines.push(`結果: 更新あり (${changedFields.length}項目)`);
		lines.push('差分:');
		lines.push(...changedFields.map(formatChangedField));

		if (unchangedFieldLabels.length > 0) {
			lines.push(`変更なし: ${unchangedFieldLabels.join(', ')}`);
		}

		lines.push(formatPersistDecision(summary));
	} else {
		lines.push('結果: 更新なし');
		lines.push(`全${summary.fields.length}項目に差分はありません。`);
		lines.push('現在値:');
		lines.push(...summary.fields.map(formatCurrentField));
		lines.push(formatPersistDecision(summary));
	}

	if (options.runUrl) {
		lines.push(`Run: ${options.runUrl}`);
	}

	return lines.join('\n');
};

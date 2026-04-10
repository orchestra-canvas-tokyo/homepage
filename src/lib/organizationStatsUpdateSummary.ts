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

type OrganizationStatsSlackSummaryOptions = {
	failedSteps?: string[];
	generatedAt?: Date;
	runUrl?: string;
	summaryDate?: string;
	workflowStatus?: string;
};

type SlackMarkdownTextObject = {
	type: 'mrkdwn';
	text: string;
};

type SlackSectionBlock = {
	type: 'section';
	text: SlackMarkdownTextObject;
};

type SlackContextBlock = {
	type: 'context';
	elements: SlackMarkdownTextObject[];
};

type SlackDividerBlock = {
	type: 'divider';
};

export type OrganizationStatsSlackBlock = SlackSectionBlock | SlackContextBlock | SlackDividerBlock;

export type OrganizationStatsSlackPayload = {
	text: string;
	blocks: OrganizationStatsSlackBlock[];
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

const slackMetricFieldOrder = [
	'youtubeTotalViewCount',
	'youtubeSubscriberCount',
	'totalAttendance'
] satisfies OrganizationStatsFieldKey[];

const slackMetricLabels = {
	totalAttendance: '累計来場者数',
	youtubeSubscriberCount: 'YT登録者数',
	youtubeTotalViewCount: 'YT総再生回数'
} satisfies Record<OrganizationStatsFieldKey, string>;

const slackMetricUnits = {
	totalAttendance: '名',
	youtubeSubscriberCount: '人',
	youtubeTotalViewCount: '回'
} satisfies Record<OrganizationStatsFieldKey, string>;

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const JST_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1000;

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

const formatJstDate = (date: Date): string =>
	new Date(date.getTime() + JST_OFFSET_MILLISECONDS).toISOString().slice(0, 10);

const getDefaultSummaryDate = (generatedAt: Date): string =>
	formatJstDate(new Date(generatedAt.getTime() - DAY_IN_MILLISECONDS));

const escapeSlackText = (value: string): string =>
	value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const createMarkdownText = (text: string): SlackMarkdownTextObject => ({
	type: 'mrkdwn',
	text
});

const createSectionBlock = (text: string): SlackSectionBlock => ({
	type: 'section',
	text: createMarkdownText(text)
});

const createContextBlock = (text: string): SlackContextBlock => ({
	type: 'context',
	elements: [createMarkdownText(text)]
});

const getOrderedSlackFields = (
	summary: Extract<OrganizationStatsUpdateSummary, { status: 'updated' | 'no_change' }>
): OrganizationStatsFieldSummary[] =>
	slackMetricFieldOrder.map((key) => {
		const field = summary.fields.find((summaryField) => summaryField.key === key);

		if (!field) {
			throw new Error(`Missing organization stats summary field: ${key}`);
		}

		return field;
	});

const formatSlackMetricField = (field: OrganizationStatsFieldSummary): string => {
	const delta = field.changed ? ` (${formatSignedInteger(field.delta)})` : '';

	return `- ${field.changed ? '🟡' : '🟢'} ${slackMetricLabels[field.key]} ${formatRawInteger(field.nextValue)}${slackMetricUnits[field.key]}${delta}`;
};

const formatFailedStepsDetail = (failedSteps: string[]): string =>
	failedSteps.length > 0
		? `GitHub Actions の後続 step に失敗しました (${failedSteps.join(', ')})`
		: 'GitHub Actions の実行に失敗しました。';

const getSlackSummaryLabel = (
	summary: OrganizationStatsUpdateSummary,
	options: Pick<OrganizationStatsSlackSummaryOptions, 'workflowStatus'>
): string => {
	if (summary.status === 'error' || options.workflowStatus === 'failure') {
		return 'エラー';
	}

	if (summary.status === 'updated') {
		return `${summary.fields.filter((field) => field.changed).length}件更新`;
	}

	return '更新なし';
};

const createSlackSummaryParts = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions
) => {
	const generatedAt = options.generatedAt ?? new Date();
	const failedSteps = options.failedSteps?.filter((step) => step !== '') ?? [];
	const title = `団体情報統計 更新サマリー | ${options.summaryDate ?? getDefaultSummaryDate(generatedAt)} JST`;
	const summaryLines = [`*サマリー: ${getSlackSummaryLabel(summary, options)}*`];
	const metricRows =
		summary.status === 'error' ? [] : getOrderedSlackFields(summary).map(formatSlackMetricField);
	const persistDecision = summary.status === 'error' ? undefined : formatPersistDecision(summary);

	if (summary.status === 'error') {
		summaryLines.push(`詳細: ${escapeSlackText(summary.errorMessage)}`);
	} else if (options.workflowStatus === 'failure') {
		summaryLines.push(`詳細: ${escapeSlackText(formatFailedStepsDetail(failedSteps))}`);
	}

	return {
		title,
		generatedAtLine: `生成: ${generatedAt.toISOString()}`,
		summaryText: summaryLines.join('\n'),
		metricRows,
		persistDecision,
		runLink: options.runUrl ? `<${options.runUrl}|実行ログ>` : undefined
	};
};

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

export const formatOrganizationStatsSlackSummary = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions = {}
): string => {
	const parts = createSlackSummaryParts(summary, options);
	const lines = [parts.title, parts.generatedAtLine, '---', parts.summaryText.replaceAll('*', '')];

	if (parts.metricRows.length > 0) {
		lines.push(...parts.metricRows);
	}

	if (parts.persistDecision) {
		lines.push(parts.persistDecision);
	}

	if (parts.runLink) {
		lines.push(parts.runLink);
	}

	return lines.join('\n');
};

export const formatOrganizationStatsSlackPayload = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions = {}
): OrganizationStatsSlackPayload => {
	const parts = createSlackSummaryParts(summary, options);
	const blocks: OrganizationStatsSlackBlock[] = [
		createSectionBlock(`*${parts.title}*`),
		createContextBlock(parts.generatedAtLine),
		{ type: 'divider' },
		createSectionBlock(parts.summaryText)
	];

	if (parts.metricRows.length > 0) {
		blocks.push(createSectionBlock(parts.metricRows.join('\n')));
	}

	if (parts.persistDecision) {
		blocks.push(createContextBlock(parts.persistDecision));
	}

	if (parts.runLink) {
		blocks.push(createSectionBlock(parts.runLink));
	}

	return {
		text: formatOrganizationStatsSlackSummary(summary, options),
		blocks
	};
};

import {
	formatAttendanceCount,
	formatYouTubeSubscriberCount,
	formatYouTubeTotalViewCount,
	shouldPersistOrganizationStats,
	type OrganizationStats,
	type PersistedOrganizationStats
} from './organizationStats.ts';
import {
	type OrganizationStatsMainBranchUpdate,
	type OrganizationStatsMainBranchUpdateSkipReason,
	type OrganizationStatsProductionPromotion,
	type OrganizationStatsProductionPromotionSkipReason
} from './organizationStatsWorkflowPromotion.ts';

export type OrganizationStatsFieldKey = keyof OrganizationStats;

export type OrganizationStatsPersistReason = 'stats_change' | 'subscriber_verification';

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
	generatedAt?: Date;
	mainBranchUpdate?: OrganizationStatsMainBranchUpdate;
	productionPromotion?: OrganizationStatsProductionPromotion;
	runUrl?: string;
	summaryDate?: string;
	workflowStatus?: string;
};

export type OrganizationStatsSlackColor = 'good' | 'warning' | 'danger';
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

const slackSummaryIcons = {
	good: '🟢',
	warning: '🟡',
	danger: '🔴'
} satisfies Record<OrganizationStatsSlackColor, string>;

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
		return '保存データ: 変更なし';
	}

	const reasons = summary.persistReasons.map((reason) => {
		if (reason === 'stats_change') {
			return '統計値差分あり';
		}

		return '登録者数検証フラグを確定';
	});

	return `保存データ: 更新対象あり（${reasons.join(' / ')}）`;
};

const formatJstDate = (date: Date): string =>
	new Date(date.getTime() + JST_OFFSET_MILLISECONDS).toISOString().slice(0, 10);

const getDefaultSummaryDate = (generatedAt: Date): string => formatJstDate(generatedAt);

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

const formatSlackStatisticField = (field: OrganizationStatsFieldSummary): string =>
	`- ${slackMetricLabels[field.key]} ${formatRawInteger(field.nextValue)}${slackMetricUnits[field.key]} (${formatSignedInteger(field.delta)})`;

const formatSlackDisplayField = (field: OrganizationStatsFieldSummary): string => {
	const statusIcon = field.displayChanged ? '🟡' : '🟢';
	const displayValue = field.displayChanged
		? `${field.previousDisplayValue} → ${field.nextDisplayValue}`
		: `${field.nextDisplayValue}（変更なし）`;

	return `- ${statusIcon} ${slackMetricLabels[field.key]} ${displayValue}`;
};

const formatFailedStepsDetail = (failedSteps: string[]): string =>
	failedSteps.length > 0
		? `GitHub Actions の後続 step に失敗しました (${failedSteps.join(', ')})`
		: 'GitHub Actions の実行に失敗しました。';

const formatWorkflowStatusDetail = (
	workflowStatus: string | undefined,
	failedSteps: string[]
): string => {
	if (workflowStatus === 'failure') {
		return formatFailedStepsDetail(failedSteps);
	}

	if (workflowStatus && workflowStatus !== 'success') {
		return `GitHub Actions の実行が ${workflowStatus} で終了しました。`;
	}

	return 'GitHub Actions の実行に失敗しました。';
};

const formatMainBranchUpdateSkipReason = (
	reason: OrganizationStatsMainBranchUpdateSkipReason
): string => {
	if (reason === 'main_moved') {
		return '実行中に main が更新されました';
	}

	return reason;
};

const formatProductionPromotionSkipReason = (
	reason: OrganizationStatsProductionPromotionSkipReason
): string => {
	if (reason === 'not_caught_up') {
		return '実行開始時点で production が main と同一内容ではありません';
	}

	if (reason === 'main_moved') {
		return 'production 反映前に main が更新されました';
	}

	return '実行中に production が更新されました';
};

const formatMainBranchUpdate = (
	mainBranchUpdate: OrganizationStatsMainBranchUpdate
): string | undefined => {
	if (mainBranchUpdate.status === 'not_attempted') {
		return undefined;
	}

	if (mainBranchUpdate.status === 'pushed') {
		return 'main: 直接コミット完了';
	}

	return `main: スキップ（${formatMainBranchUpdateSkipReason(mainBranchUpdate.reason)}）`;
};

const formatProductionPromotion = (
	productionPromotion: OrganizationStatsProductionPromotion
): string | undefined => {
	if (productionPromotion.status === 'not_attempted') {
		return undefined;
	}

	if (productionPromotion.status === 'merged') {
		return 'production: main の最新コミットを自動マージ';
	}

	return `production: スキップ（${formatProductionPromotionSkipReason(productionPromotion.reason)}）`;
};

const getSlackSummaryLabel = (
	summary: OrganizationStatsUpdateSummary,
	options: Pick<OrganizationStatsSlackSummaryOptions, 'workflowStatus'>
): string => {
	if (getOrganizationStatsSlackColor(summary, options) === 'danger') {
		return 'エラー';
	}

	if (summary.status === 'updated') {
		return `${summary.fields.filter((field) => field.displayChanged).length}件更新`;
	}

	return '更新なし';
};

const createSlackSummaryParts = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions
) => {
	const generatedAt = options.generatedAt ?? new Date();
	const failedSteps = options.failedSteps?.filter((step) => step !== '') ?? [];
	const slackColor = getOrganizationStatsSlackColor(summary, options);
	const title = `団体情報統計 更新サマリー | ${options.summaryDate ?? getDefaultSummaryDate(generatedAt)} JST`;
	const summaryLines = [
		`*サマリー: ${slackSummaryIcons[slackColor]} ${getSlackSummaryLabel(summary, options)}*`
	];
	const branchStatusLines = [
		options.mainBranchUpdate ? formatMainBranchUpdate(options.mainBranchUpdate) : undefined,
		options.productionPromotion ? formatProductionPromotion(options.productionPromotion) : undefined
	].filter((line): line is string => line !== undefined);
	const statisticRows =
		summary.status === 'error'
			? []
			: getOrderedSlackFields(summary).map((field) => formatSlackStatisticField(field));
	const displayRows =
		summary.status === 'error'
			? []
			: getOrderedSlackFields(summary).map((field) => formatSlackDisplayField(field));
	const persistDecision = summary.status === 'error' ? undefined : formatPersistDecision(summary);

	if (summary.status === 'error') {
		summaryLines.push(`詳細: ${escapeSlackText(summary.errorMessage)}`);
	} else if (slackColor === 'danger') {
		summaryLines.push(
			`詳細: ${escapeSlackText(formatWorkflowStatusDetail(options.workflowStatus, failedSteps))}`
		);
	}

	summaryLines.push(...branchStatusLines.map((line) => `- ${line}`));

	return {
		title,
		generatedAtLine: `生成: ${generatedAt.toISOString()}`,
		summaryText: summaryLines.join('\n'),
		statisticRows,
		displayRows,
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

	if (fields.some((field) => field.changed)) {
		persistReasons.push('stats_change');
	}

	if (!current.youtubeSubscriberCountVerified) {
		persistReasons.push('subscriber_verification');
	}

	return {
		status: fields.some((field) => field.displayChanged) ? 'updated' : 'no_change',
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

	if (summary.status === 'updated') {
		return 'warning';
	}

	return 'good';
};

export const formatOrganizationStatsSlackSummary = (
	summary: OrganizationStatsUpdateSummary,
	options: OrganizationStatsSlackSummaryOptions = {}
): string => {
	const parts = createSlackSummaryParts(summary, options);
	const lines = [parts.title, parts.generatedAtLine, '---', parts.summaryText.replaceAll('*', '')];

	if (parts.statisticRows.length > 0) {
		lines.push('統計データ（前回取得値との差分）', ...parts.statisticRows);
	}

	if (parts.displayRows.length > 0) {
		lines.push('表示データ（HP表示値）', ...parts.displayRows);
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

	if (parts.statisticRows.length > 0) {
		blocks.push(
			createSectionBlock(`*統計データ（前回取得値との差分）*\n${parts.statisticRows.join('\n')}`)
		);
	}

	if (parts.displayRows.length > 0) {
		blocks.push(createSectionBlock(`*表示データ（HP表示値）*\n${parts.displayRows.join('\n')}`));
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

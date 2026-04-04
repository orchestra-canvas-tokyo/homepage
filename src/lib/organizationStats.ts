export type OrganizationStats = {
	totalAttendance: number;
	youtubeSubscriberCount: number;
	youtubeTotalViewCount: number;
};

export type PersistedOrganizationStats = OrganizationStats & {
	youtubeSubscriberCountVerified: boolean;
};

const ATTENDANCE_DISPLAY_STEP = 1_000;
const YOUTUBE_SUBSCRIBER_DISPLAY_STEP = 1_000;
const YOUTUBE_TOTAL_VIEW_DISPLAY_STEP = 100_000;

const formatInteger = (value: number): string => value.toLocaleString('ja-JP');

const floorToStep = (value: number, step: number): number => Math.floor(value / step) * step;

const parseInteger = (value: string, label: string): number => {
	const normalized = value
		.replaceAll(',', '')
		.replace(/^\uFEFF/, '')
		.trim();

	if (!/^\d+$/.test(normalized)) {
		throw new Error(`Invalid integer for ${label}: ${value}`);
	}

	return Number.parseInt(normalized, 10);
};

export const formatAttendanceCount = (value: number): string =>
	`${formatInteger(floorToStep(value, ATTENDANCE_DISPLAY_STEP))}名`;

export const formatAttendanceSummary = (value: number): string =>
	`${formatAttendanceCount(value)}を超える`;

export const formatYouTubeSubscriberCount = (value: number): string => {
	const roundedValue = floorToStep(value, YOUTUBE_SUBSCRIBER_DISPLAY_STEP);
	const tenThousands = roundedValue / 10_000;

	return `${Number.isInteger(tenThousands) ? tenThousands.toFixed(0) : tenThousands.toFixed(1)}万人`;
};

export const formatYouTubeTotalViewCount = (value: number): string =>
	`${Math.floor(value / YOUTUBE_TOTAL_VIEW_DISPLAY_STEP) * 10}万回`;

export const getOrganizationStatsDisplayValues = (stats: OrganizationStats) => ({
	totalAttendance: formatAttendanceCount(stats.totalAttendance),
	totalAttendanceSummary: formatAttendanceSummary(stats.totalAttendance),
	youtubeSubscriberCount: formatYouTubeSubscriberCount(stats.youtubeSubscriberCount),
	youtubeTotalViewCount: formatYouTubeTotalViewCount(stats.youtubeTotalViewCount)
});

export const hasOrganizationStatsDisplayChange = (
	currentStats: OrganizationStats,
	nextStats: OrganizationStats
): boolean => {
	const currentDisplayValues = getOrganizationStatsDisplayValues(currentStats);
	const nextDisplayValues = getOrganizationStatsDisplayValues(nextStats);

	return (
		currentDisplayValues.totalAttendance !== nextDisplayValues.totalAttendance ||
		currentDisplayValues.youtubeSubscriberCount !== nextDisplayValues.youtubeSubscriberCount ||
		currentDisplayValues.youtubeTotalViewCount !== nextDisplayValues.youtubeTotalViewCount
	);
};

export const shouldPersistOrganizationStats = (
	currentStats: PersistedOrganizationStats,
	nextStats: OrganizationStats
): boolean =>
	!currentStats.youtubeSubscriberCountVerified ||
	hasOrganizationStatsDisplayChange(currentStats, nextStats);

export const parseCsvText = (csvText: string): string[][] => {
	const rows: string[][] = [];
	let currentRow: string[] = [];
	let currentField = '';
	let isInsideQuotes = false;

	for (let index = 0; index < csvText.length; index += 1) {
		const character = csvText[index];

		if (isInsideQuotes) {
			if (character === '"') {
				if (csvText[index + 1] === '"') {
					currentField += '"';
					index += 1;
				} else {
					isInsideQuotes = false;
				}
			} else {
				currentField += character;
			}

			continue;
		}

		if (character === '"') {
			isInsideQuotes = true;
			continue;
		}

		if (character === ',') {
			currentRow.push(currentField);
			currentField = '';
			continue;
		}

		if (character === '\n') {
			currentRow.push(currentField);
			rows.push(currentRow);
			currentRow = [];
			currentField = '';
			continue;
		}

		if (character !== '\r') {
			currentField += character;
		}
	}

	currentRow.push(currentField);

	if (currentRow.length > 1 || currentRow[0] !== '' || rows.length === 0) {
		rows.push(currentRow);
	}

	return rows;
};

export const extractTotalAttendanceFromCsv = (csvText: string): number => {
	const totalAttendance = parseCsvText(csvText)
		.flatMap((row) => row)
		.map((cell) => cell.trim())
		.find((cell) => cell !== '');

	if (totalAttendance === undefined) {
		throw new Error('Attendance CSV is empty.');
	}

	return parseInteger(totalAttendance, 'attendance total');
};

export const extractYouTubeChannelStatistics = (
	apiResponse: unknown
): Pick<OrganizationStats, 'youtubeSubscriberCount' | 'youtubeTotalViewCount'> => {
	if (!apiResponse || typeof apiResponse !== 'object' || !('items' in apiResponse)) {
		throw new Error('Invalid YouTube API response: missing items.');
	}

	const { items } = apiResponse as {
		items?: Array<{
			statistics?: {
				subscriberCount?: string;
				viewCount?: string;
			};
		}>;
	};

	const statistics = items?.[0]?.statistics;

	if (!statistics?.subscriberCount || !statistics.viewCount) {
		throw new Error('Invalid YouTube API response: missing channel statistics.');
	}

	return {
		youtubeSubscriberCount: parseInteger(statistics.subscriberCount, 'YouTube subscriberCount'),
		youtubeTotalViewCount: parseInteger(statistics.viewCount, 'YouTube viewCount')
	};
};

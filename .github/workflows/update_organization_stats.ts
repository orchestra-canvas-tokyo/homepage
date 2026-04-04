import { writeFile } from 'node:fs/promises';

import currentOrganizationStats from '../../src/lib/organizationStats.json' with { type: 'json' };
import { normalizePublishedGoogleSheetCsvUrl } from '../../src/lib/googleSheets.ts';
import {
	extractTotalAttendanceFromCsv,
	extractYouTubeChannelStatistics,
	getOrganizationStatsDisplayValues,
	type OrganizationStats,
	type PersistedOrganizationStats
} from '../../src/lib/organizationStats.ts';
import {
	createOrganizationStatsErrorSummary,
	summarizeOrganizationStatsUpdate,
	type OrganizationStatsUpdateSummary
} from '../../src/lib/organizationStatsUpdateSummary.ts';

const CHANNEL_ID = process.env.CHANNEL_ID;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const ATTENDANCE_CSV_URL = process.env.ATTENDANCE_CSV_URL;
const GITHUB_ENV = process.env.GITHUB_ENV;
const MAX_ALLOWED_VIEW_INCREASE = Number.parseInt(
	process.env.MAX_ALLOWED_VIEW_INCREASE ?? '5000000',
	10
);
const MAX_ALLOWED_SUBSCRIBER_INCREASE = Number.parseInt(
	process.env.MAX_ALLOWED_SUBSCRIBER_INCREASE ?? '5000',
	10
);
const MAX_ALLOWED_ATTENDANCE_INCREASE = Number.parseInt(
	process.env.MAX_ALLOWED_ATTENDANCE_INCREASE ?? '5000',
	10
);
const ORGANIZATION_STATS_PATH = 'src/lib/organizationStats.json';

const appendGitHubEnv = async (key: string, value: string): Promise<void> => {
	if (!GITHUB_ENV) {
		return;
	}

	await writeFile(GITHUB_ENV, `${key}=${value}\n`, {
		encoding: 'utf-8',
		flag: 'a'
	});
};

const appendUpdateSummary = async (summary: OrganizationStatsUpdateSummary): Promise<void> => {
	await appendGitHubEnv('ORGANIZATION_STATS_UPDATE_SUMMARY', JSON.stringify(summary));
};

const ensureValidIncrease = (
	label: string,
	currentValue: number,
	nextValue: number,
	maxAllowedIncrease: number
): void => {
	if (nextValue < currentValue) {
		throw new Error(`Guardrail triggered: ${label} decreased (${nextValue} < ${currentValue}).`);
	}

	if (nextValue - currentValue > maxAllowedIncrease) {
		throw new Error(
			`Guardrail triggered: ${label} increased too much (${nextValue - currentValue} > ${maxAllowedIncrease}).`
		);
	}
};

const fetchText = async (url: string): Promise<string> => {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
	}

	return response.text();
};

const fetchJson = async (url: string): Promise<unknown> => {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
	}

	return response.json();
};

const updateOrganizationStats = async (): Promise<void> => {
	if (!CHANNEL_ID || !YOUTUBE_API_KEY || !ATTENDANCE_CSV_URL) {
		throw new Error('Missing CHANNEL_ID, YOUTUBE_API_KEY, or ATTENDANCE_CSV_URL.');
	}

	const attendanceCsvText = await fetchText(
		normalizePublishedGoogleSheetCsvUrl(ATTENDANCE_CSV_URL)
	);
	const totalAttendance = extractTotalAttendanceFromCsv(attendanceCsvText);
	const youTubeApiUrl =
		'https://www.googleapis.com/youtube/v3/channels' +
		`?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
	const youTubeApiResponse = await fetchJson(youTubeApiUrl);
	const youTubeStatistics = extractYouTubeChannelStatistics(youTubeApiResponse);

	const persistedCurrentOrganizationStats = currentOrganizationStats as PersistedOrganizationStats;
	const nextOrganizationStats: OrganizationStats = {
		totalAttendance,
		youtubeSubscriberCount: youTubeStatistics.youtubeSubscriberCount,
		youtubeTotalViewCount: youTubeStatistics.youtubeTotalViewCount
	};
	const summary = summarizeOrganizationStatsUpdate(
		persistedCurrentOrganizationStats,
		nextOrganizationStats
	);

	ensureValidIncrease(
		'total attendance',
		persistedCurrentOrganizationStats.totalAttendance,
		nextOrganizationStats.totalAttendance,
		MAX_ALLOWED_ATTENDANCE_INCREASE
	);
	if (persistedCurrentOrganizationStats.youtubeSubscriberCountVerified) {
		ensureValidIncrease(
			'YouTube subscriber count',
			persistedCurrentOrganizationStats.youtubeSubscriberCount,
			nextOrganizationStats.youtubeSubscriberCount,
			MAX_ALLOWED_SUBSCRIBER_INCREASE
		);
	}
	ensureValidIncrease(
		'YouTube total view count',
		persistedCurrentOrganizationStats.youtubeTotalViewCount,
		nextOrganizationStats.youtubeTotalViewCount,
		MAX_ALLOWED_VIEW_INCREASE
	);

	await appendGitHubEnv('SHOULD_COMMIT', 'false');
	await appendUpdateSummary(summary);

	if (summary.status === 'no_change') {
		console.log('No organization stats value change detected.');
	}

	if (!summary.shouldPersist) {
		console.log('No persisted organization stats update is required.');
		return;
	}

	const nextPersistedOrganizationStats: PersistedOrganizationStats = {
		...nextOrganizationStats,
		youtubeSubscriberCountVerified: true
	};

	await writeFile(
		ORGANIZATION_STATS_PATH,
		`${JSON.stringify(nextPersistedOrganizationStats, null, '\t')}\n`,
		'utf-8'
	);

	const displayValues = getOrganizationStatsDisplayValues(nextOrganizationStats);

	await appendGitHubEnv('SHOULD_COMMIT', 'true');
	await appendGitHubEnv('TOTAL_ATTENDANCE', String(nextOrganizationStats.totalAttendance));
	await appendGitHubEnv(
		'YOUTUBE_SUBSCRIBER_COUNT',
		String(nextOrganizationStats.youtubeSubscriberCount)
	);
	await appendGitHubEnv(
		'YOUTUBE_TOTAL_VIEW_COUNT',
		String(nextOrganizationStats.youtubeTotalViewCount)
	);
	await appendGitHubEnv('DISPLAY_TOTAL_ATTENDANCE', displayValues.totalAttendance);
	await appendGitHubEnv('DISPLAY_YOUTUBE_SUBSCRIBER_COUNT', displayValues.youtubeSubscriberCount);
	await appendGitHubEnv('DISPLAY_YOUTUBE_TOTAL_VIEW_COUNT', displayValues.youtubeTotalViewCount);
};

updateOrganizationStats().catch(async (error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(message);

	if (GITHUB_ENV) {
		await appendGitHubEnv('SHOULD_COMMIT', 'false');
		await appendUpdateSummary(createOrganizationStatsErrorSummary(message));
	}

	process.exitCode = 1;
});

import {
	createOrganizationStatsErrorSummary,
	formatOrganizationStatsSlackPayload,
	type OrganizationStatsUpdateSummary
} from '../../src/lib/organizationStatsUpdateSummary.ts';

const SLACK_WEBHOOK_URL = process.env.SLACK_ORGANIZATION_STATS_WEBHOOK_URL;

const writeError = async (message: string): Promise<void> =>
	new Promise((resolve) => {
		process.stderr.write(`${message}\n`, () => resolve());
	});

const parseSummary = (): OrganizationStatsUpdateSummary => {
	const rawSummary = process.env.ORGANIZATION_STATS_UPDATE_SUMMARY;

	if (!rawSummary) {
		return createOrganizationStatsErrorSummary('更新サマリーを取得できませんでした。');
	}

	try {
		return JSON.parse(rawSummary) as OrganizationStatsUpdateSummary;
	} catch {
		return createOrganizationStatsErrorSummary('更新サマリーの JSON 解析に失敗しました。');
	}
};

const getFailedSteps = (): string[] =>
	[
		['Update organization stats', process.env.UPDATE_ORGANIZATION_STATS_OUTCOME],
		['Validate changed files', process.env.VALIDATE_CHANGED_FILES_OUTCOME],
		['Commit and push stats branch', process.env.COMMIT_AND_PUSH_STATS_BRANCH_OUTCOME],
		['Create or update main PR', process.env.CREATE_OR_UPDATE_MAIN_PR_OUTCOME]
	]
		.filter(([, outcome]) => outcome === 'failure')
		.map(([name]) => name);

const getRunUrl = (): string | undefined => {
	const serverUrl = process.env.GITHUB_SERVER_URL;
	const repository = process.env.GITHUB_REPOSITORY;
	const runId = process.env.GITHUB_RUN_ID;

	if (!serverUrl || !repository || !runId) {
		return undefined;
	}

	return `${serverUrl}/${repository}/actions/runs/${runId}`;
};

const postSlackSummary = async (): Promise<void> => {
	if (!SLACK_WEBHOOK_URL) {
		throw new Error('Missing SLACK_ORGANIZATION_STATS_WEBHOOK_URL.');
	}

	const summary = parseSummary();
	const payload = formatOrganizationStatsSlackPayload(summary, {
		failedSteps: getFailedSteps(),
		runUrl: getRunUrl(),
		workflowStatus: process.env.WORKFLOW_JOB_STATUS
	});
	const response = await fetch(SLACK_WEBHOOK_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Failed to post Slack summary: ${response.status} ${response.statusText} ${body}`
		);
	}
};

postSlackSummary().catch(async (error: unknown) => {
	const message = error instanceof Error ? error.message : String(error);
	await writeError(message);
	process.exitCode = 1;
});

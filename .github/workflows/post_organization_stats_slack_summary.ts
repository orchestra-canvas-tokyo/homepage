import {
	createOrganizationStatsErrorSummary,
	formatOrganizationStatsSlackPayload,
	type OrganizationStatsUpdateSummary
} from '../../src/lib/organizationStatsUpdateSummary.ts';
import {
	type OrganizationStatsMainBranchUpdate,
	type OrganizationStatsProductionPromotion
} from '../../src/lib/organizationStatsWorkflowPromotion.ts';

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
		['Commit and push to main', process.env.COMMIT_AND_PUSH_TO_MAIN_OUTCOME],
		['Merge to production', process.env.MERGE_TO_PRODUCTION_OUTCOME]
	]
		.filter(([, outcome]) => outcome === 'failure')
		.map(([name]) => name);

const parseMainBranchUpdate = (): OrganizationStatsMainBranchUpdate => {
	if (process.env.MAIN_BRANCH_UPDATE_STATUS === 'pushed') {
		return {
			status: 'pushed'
		};
	}

	if (process.env.MAIN_BRANCH_UPDATE_STATUS === 'skipped') {
		return {
			status: 'skipped',
			reason: 'main_moved'
		};
	}

	return {
		status: 'not_attempted'
	};
};

const parseProductionPromotion = (): OrganizationStatsProductionPromotion => {
	if (process.env.PRODUCTION_PROMOTION_STATUS === 'merged') {
		return {
			status: 'merged'
		};
	}

	if (process.env.PRODUCTION_PROMOTION_STATUS === 'skipped') {
		const reason = process.env.PRODUCTION_PROMOTION_SKIP_REASON;

		return {
			status: 'skipped',
			reason: reason === 'main_moved' || reason === 'production_moved' ? reason : 'not_caught_up'
		};
	}

	return {
		status: 'not_attempted'
	};
};

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
		mainBranchUpdate: parseMainBranchUpdate(),
		productionPromotion: parseProductionPromotion(),
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

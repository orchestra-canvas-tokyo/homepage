import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

import {
	getOrganizationStatsProductionPromotionGate,
	hasMatchingBranchContent
} from '../organizationStatsWorkflowPromotion';

const execFileAsync = promisify(execFile);
const temporaryDirectories: string[] = [];

const runGit = async (cwd: string, args: string[]): Promise<string> => {
	const { stdout } = await execFileAsync('git', ['-c', 'commit.gpgsign=false', ...args], {
		cwd,
		env: {
			...process.env,
			GIT_AUTHOR_NAME: 'Test User',
			GIT_AUTHOR_EMAIL: 'test@example.com',
			GIT_COMMITTER_NAME: 'Test User',
			GIT_COMMITTER_EMAIL: 'test@example.com'
		}
	});

	return stdout.trim();
};

const writeTrackedFile = async (cwd: string, content: string): Promise<void> => {
	await writeFile(join(cwd, 'stats.txt'), `${content}\n`, 'utf-8');
	await runGit(cwd, ['add', 'stats.txt']);
};

const commitFileOnBranch = async (
	cwd: string,
	branch: string,
	content: string,
	message: string
) => {
	await runGit(cwd, ['checkout', branch]);
	await writeTrackedFile(cwd, content);
	await runGit(cwd, ['commit', '-m', message]);
};

const commitEmptyOnBranch = async (cwd: string, branch: string, message: string) => {
	await runGit(cwd, ['checkout', branch]);
	await runGit(cwd, ['commit', '--allow-empty', '-m', message]);
};

const getRevision = async (cwd: string, revision: string): Promise<string> =>
	runGit(cwd, ['rev-parse', revision]);

const createRepository = async (): Promise<string> => {
	const cwd = await mkdtemp(join(tmpdir(), 'organization-stats-promotion-'));
	temporaryDirectories.push(cwd);
	await runGit(cwd, ['init', '--initial-branch=main']);
	await runGit(cwd, ['config', 'user.name', 'Test User']);
	await runGit(cwd, ['config', 'user.email', 'test@example.com']);
	await writeTrackedFile(cwd, 'baseline');
	await runGit(cwd, ['commit', '-m', 'initial commit']);
	await runGit(cwd, ['branch', 'production']);

	return cwd;
};

afterEach(async () => {
	await Promise.all(
		temporaryDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true }))
	);
});

describe('organization stats workflow promotion', () => {
	it('treats matching branch trees as releasable even when commit history differs', async () => {
		const cwd = await createRepository();
		await commitEmptyOnBranch(cwd, 'production', 'production release marker');

		const mainTreeSha = await getRevision(cwd, 'main^{tree}');
		const productionTreeSha = await getRevision(cwd, 'production^{tree}');
		const expectedMainSha = await getRevision(cwd, 'main');
		const expectedProductionSha = await getRevision(cwd, 'production');

		expect(hasMatchingBranchContent(mainTreeSha, productionTreeSha)).toBe(true);
		expect(
			getOrganizationStatsProductionPromotionGate({
				currentMainSha: expectedMainSha,
				currentProductionSha: expectedProductionSha,
				expectedMainSha,
				expectedProductionSha,
				mainBranchUpdate: {
					status: 'pushed'
				},
				preUpdateMainTreeSha: mainTreeSha,
				preUpdateProductionTreeSha: productionTreeSha
			})
		).toEqual({
			status: 'ready'
		});
	});

	it('skips production promotion when production content is behind main at workflow start', async () => {
		const cwd = await createRepository();
		await commitFileOnBranch(cwd, 'main', 'main changed', 'main update');

		const mainTreeSha = await getRevision(cwd, 'main^{tree}');
		const productionTreeSha = await getRevision(cwd, 'production^{tree}');

		expect(
			getOrganizationStatsProductionPromotionGate({
				currentMainSha: await getRevision(cwd, 'main'),
				currentProductionSha: await getRevision(cwd, 'production'),
				expectedMainSha: await getRevision(cwd, 'main'),
				expectedProductionSha: await getRevision(cwd, 'production'),
				mainBranchUpdate: {
					status: 'pushed'
				},
				preUpdateMainTreeSha: mainTreeSha,
				preUpdateProductionTreeSha: productionTreeSha
			})
		).toEqual({
			status: 'skipped',
			reason: 'not_caught_up'
		});
	});

	it('skips production promotion when main advances after the stats commit', async () => {
		const cwd = await createRepository();
		await commitEmptyOnBranch(cwd, 'production', 'production release marker');

		const preUpdateMainTreeSha = await getRevision(cwd, 'main^{tree}');
		const preUpdateProductionTreeSha = await getRevision(cwd, 'production^{tree}');
		const expectedMainSha = await getRevision(cwd, 'main');
		const expectedProductionSha = await getRevision(cwd, 'production');

		await commitFileOnBranch(cwd, 'main', 'main advanced', 'unexpected main advance');

		expect(
			getOrganizationStatsProductionPromotionGate({
				currentMainSha: await getRevision(cwd, 'main'),
				currentProductionSha: await getRevision(cwd, 'production'),
				expectedMainSha,
				expectedProductionSha,
				mainBranchUpdate: {
					status: 'pushed'
				},
				preUpdateMainTreeSha,
				preUpdateProductionTreeSha
			})
		).toEqual({
			status: 'skipped',
			reason: 'main_moved'
		});
	});

	it('skips production promotion when production advances after the baseline check', async () => {
		const cwd = await createRepository();
		await commitEmptyOnBranch(cwd, 'production', 'production release marker');

		const preUpdateMainTreeSha = await getRevision(cwd, 'main^{tree}');
		const preUpdateProductionTreeSha = await getRevision(cwd, 'production^{tree}');
		const expectedMainSha = await getRevision(cwd, 'main');
		const expectedProductionSha = await getRevision(cwd, 'production');

		await commitFileOnBranch(
			cwd,
			'production',
			'production advanced',
			'unexpected production advance'
		);

		expect(
			getOrganizationStatsProductionPromotionGate({
				currentMainSha: await getRevision(cwd, 'main'),
				currentProductionSha: await getRevision(cwd, 'production'),
				expectedMainSha,
				expectedProductionSha,
				mainBranchUpdate: {
					status: 'pushed'
				},
				preUpdateMainTreeSha,
				preUpdateProductionTreeSha
			})
		).toEqual({
			status: 'skipped',
			reason: 'production_moved'
		});
	});
});

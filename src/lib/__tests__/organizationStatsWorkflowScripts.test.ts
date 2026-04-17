import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(testDirectory, '../../..');

const runWorkflowScript = (
	scriptPath: string
): { code: number; output: string; stderr: string; stdout: string } => {
	const env = { ...process.env };
	const inheritedKeysToDelete = Object.keys(env).filter(
		(key) => key === 'NODE_OPTIONS' || key.startsWith('VITEST')
	);

	delete env.ATTENDANCE_CSV_URL;
	delete env.CHANNEL_ID;
	delete env.GITHUB_ENV;
	delete env.ORGANIZATION_STATS_UPDATE_SUMMARY;
	delete env.SLACK_ORGANIZATION_STATS_WEBHOOK_URL;
	delete env.YOUTUBE_API_KEY;

	for (const key of inheritedKeysToDelete) {
		delete env[key];
	}

	const result = spawnSync(process.execPath, [scriptPath], {
		cwd: repositoryRoot,
		env,
		encoding: 'utf-8'
	});

	const stdout = result.stdout ?? '';
	const stderr = result.stderr ?? '';

	return {
		code: result.status ?? 1,
		output: `${stdout}${stderr}`,
		stderr,
		stdout
	};
};

describe('organization stats workflow scripts', () => {
	it('loads update_organization_stats.ts with native Node resolution', () => {
		const result = runWorkflowScript('.github/workflows/update_organization_stats.ts');

		expect(result.code).toBe(1);
		expect(result.output).not.toContain('ERR_MODULE_NOT_FOUND');
		if (result.output !== '') {
			expect(result.output).toContain(
				'Missing CHANNEL_ID, YOUTUBE_API_KEY, or ATTENDANCE_CSV_URL.'
			);
		}
	});

	it('loads post_organization_stats_slack_summary.ts with native Node resolution', () => {
		const result = runWorkflowScript('.github/workflows/post_organization_stats_slack_summary.ts');

		expect(result.code).toBe(1);
		expect(result.output).not.toContain('ERR_MODULE_NOT_FOUND');
		if (result.output !== '') {
			expect(result.output).toContain('Missing SLACK_ORGANIZATION_STATS_WEBHOOK_URL.');
		}
	});
});

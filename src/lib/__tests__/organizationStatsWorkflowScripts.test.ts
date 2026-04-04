import { execFile } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(testDirectory, '../../..');

const runWorkflowScript = async (scriptPath: string): Promise<{ code: number; stderr: string }> => {
	const env = { ...process.env };

	delete env.ATTENDANCE_CSV_URL;
	delete env.CHANNEL_ID;
	delete env.GITHUB_ENV;
	delete env.ORGANIZATION_STATS_UPDATE_SUMMARY;
	delete env.SLACK_ORGANIZATION_STATS_WEBHOOK_URL;
	delete env.YOUTUBE_API_KEY;

	try {
		await execFileAsync(process.execPath, [scriptPath], {
			cwd: repositoryRoot,
			env
		});

		return { code: 0, stderr: '' };
	} catch (error) {
		const { code = 1, stderr = '' } = error as {
			code?: number;
			stderr?: string;
		};

		return {
			code,
			stderr
		};
	}
};

describe('organization stats workflow scripts', () => {
	it('loads update_organization_stats.ts with native Node resolution', async () => {
		const result = await runWorkflowScript('.github/workflows/update_organization_stats.ts');

		expect(result.code).toBe(1);
		expect(result.stderr).toContain('Missing CHANNEL_ID, YOUTUBE_API_KEY, or ATTENDANCE_CSV_URL.');
		expect(result.stderr).not.toContain('ERR_MODULE_NOT_FOUND');
	});

	it('loads post_organization_stats_slack_summary.ts with native Node resolution', async () => {
		const result = await runWorkflowScript(
			'.github/workflows/post_organization_stats_slack_summary.ts'
		);

		expect(result.code).toBe(1);
		expect(result.stderr).toContain('Missing SLACK_ORGANIZATION_STATS_WEBHOOK_URL.');
		expect(result.stderr).not.toContain('ERR_MODULE_NOT_FOUND');
	});
});

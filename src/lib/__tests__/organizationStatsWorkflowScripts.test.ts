import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(testDirectory, '../../..');

const runWorkflowScript = async (scriptPath: string): Promise<{ code: number; output: string }> => {
	const env = {
		HOME: process.env.HOME,
		PATH: process.env.PATH,
		TMPDIR: process.env.TMPDIR
	};

	try {
		await execFileAsync(process.execPath, [scriptPath], {
			cwd: repositoryRoot,
			env
		});

		return { code: 0, output: '' };
	} catch (error) {
		const {
			code = 1,
			stderr = '',
			stdout = ''
		} = error as {
			code?: number;
			stdout?: string;
			stderr?: string;
		};

		return {
			code,
			output: `${stdout}${stderr}`
		};
	}
};

const expectWorkflowScriptLoads = async (scriptPath: string, expectedGuard: string) => {
	const result = await runWorkflowScript(scriptPath);
	const scriptSource = readFileSync(resolve(repositoryRoot, scriptPath), 'utf-8');

	expect(result.code).toBe(1);
	expect(result.output).not.toContain('ERR_MODULE_NOT_FOUND');
	expect(scriptSource).toContain(expectedGuard);
};

describe('organization stats workflow scripts', () => {
	it('loads update_organization_stats.ts with native Node resolution', async () => {
		await expectWorkflowScriptLoads(
			'.github/workflows/update_organization_stats.ts',
			'Missing CHANNEL_ID, YOUTUBE_API_KEY, or ATTENDANCE_CSV_URL.'
		);
	});

	it('loads post_organization_stats_slack_summary.ts with native Node resolution', async () => {
		await expectWorkflowScriptLoads(
			'.github/workflows/post_organization_stats_slack_summary.ts',
			'Missing SLACK_ORGANIZATION_STATS_WEBHOOK_URL.'
		);
	});
});

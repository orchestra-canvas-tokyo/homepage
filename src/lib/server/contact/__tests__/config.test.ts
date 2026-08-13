import { describe, expect, it } from 'vitest';
import { resolveContactRuntimeConfig } from '../config';

describe('resolveContactRuntimeConfig', () => {
	it('only treats the explicit production value as production', () => {
		const config = resolveContactRuntimeConfig({
			DEPLOYMENT_ENV: 'preview',
			TURNSTILE_HOSTNAMES: 'preview.example.com, Example.COM'
		});

		expect(config.isProduction).toBe(false);
		expect(config.turnstileHostnames).toEqual(['preview.example.com', 'example.com']);
	});

	it('rejects local Turnstile hostnames in production', () => {
		const config = resolveContactRuntimeConfig({
			DEPLOYMENT_ENV: 'production',
			TURNSTILE_HOSTNAMES: 'www.orch-canvas.tokyo,localhost'
		});

		expect(config.isProduction).toBe(true);
		expect(config.configurationError).toMatch(/must not include local/);
	});
});

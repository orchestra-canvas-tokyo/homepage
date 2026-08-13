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
		expect(config.allowTurnstileTestingResponse).toBe(false);
	});

	it('allows documented testing responses only with the always-pass site key outside production', () => {
		const preview = resolveContactRuntimeConfig({
			DEPLOYMENT_ENV: 'preview',
			TURNSTILE_SITE_KEY: '1x00000000000000000000AA'
		});
		const production = resolveContactRuntimeConfig({
			DEPLOYMENT_ENV: 'production',
			TURNSTILE_SITE_KEY: '1x00000000000000000000AA'
		});

		expect(preview.allowTurnstileTestingResponse).toBe(true);
		expect(production.allowTurnstileTestingResponse).toBe(false);
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
